import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './CodeEditor.css';

const socket = io('http://localhost:5000');

function CodeEditor() {
    const [content, setContent] = useState('');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    useEffect(() => {
        socket.on('updateContent',
            (updatedContent) => {
                setContent(updatedContent);
            });

        socket.on('updateStyleBold',
            (bold) => {
                setBold(bold);
            });

        socket.on('updateStyleItalic',
            (italic) => {
                setItalic(italic);
            });

        socket.on('updateStyleUnderline',
            (underline) => {
                setUnderline(underline);
            });

        return () => {
            socket.off('updateContent');
        };
    }, [bold, italic, underline]);

    const handleEdit = (event) => {
        const updatedContent = event.target.value;
        setContent(updatedContent);
        socket.emit('edit', updatedContent);
    };

    const handleBold = () => {
        if (!bold) {
            setBold(true);
            socket.emit('bold', true);
        }
        else {
            setBold(false);
            socket.emit('bold', false);
        }
    }

    const handleItalic = () => {
        if (!italic) {
            setItalic(true);
            socket.emit('italic', true);
        }
        else {
            setItalic(false);
            socket.emit('italic', false);
        }
    }

    const handleUnderline = () => {
        if (!underline) {
            setUnderline(true);
            socket.emit('underline', true);
        }
        else {
            setUnderline(false);
            socket.emit('underline', false);
        }
    }


    return (
        <div className="App">
            <h1>Real-time Collaborative Editor</h1>
            <div className='controls'>
                <button onClick={() => handleBold()}>
                    BOLD
                </button>
                <button onClick={() => handleItalic()}>
                    ITALIC
                </button>
                <button onClick={() => handleUnderline()}>
                    UNDERLINE
                </button>
            </div>
            <textarea
                value={content}
                onChange={handleEdit}
                rows={10}
                cols={50}
                style={{
                    fontWeight: bold ? 'bold' : 'normal',
                    fontStyle: italic ? 'italic' : 'normal',
                    textDecoration: underline ? 'underline' : 'none'
                }}
            />
        </div>
    );
}

export default CodeEditor;