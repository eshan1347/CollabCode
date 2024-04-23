import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './CodeEdi.css';
import axios from 'axios'
// import AWS from 'aws-sdk';


const socket = io('http://localhost:5000');

function CodeEditor() {
    const [content, setContent] = useState('');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [result, setResult] = useState('');
    const [ext, setExt] = useState('py');
    const [file, setFile] = useState(null);

    useEffect(() => {

        setExt('py');

        socket.on('updateContent', (updatedContent) => {
            setContent(updatedContent);
        });

        socket.on('updateStyleBold', (bold) => {
            setBold(bold);
        });

        socket.on('updateStyleItalic', (italic) => {
            setItalic(italic);
        });

        socket.on('updateStyleUnderline', (underline) => {
            setUnderline(underline);
        });

        return () => {
            socket.off('updateContent');
        };
    }, []);

    const handleEdit = (event) => {
        const updatedContent = event.target.value;
        setContent(updatedContent);
        socket.emit('edit', updatedContent);
    };

    const handleBold = () => {
        const newBold = !bold;
        setBold(newBold);
        socket.emit('bold', newBold);
    }

    const handleItalic = () => {
        const newItalic = !italic;
        setItalic(newItalic);
        socket.emit('italic', newItalic);
    }

    const handleUnderline = () => {
        const newUnderline = !underline;
        setUnderline(newUnderline);
        socket.emit('underline', newUnderline);
    }

    // const handleRunClick = async () => {
    //     const code = content; // Assuming content holds the code from the textarea
    //     const language = 'PYTHON'; // Set the language according to your selection
    //     const input = ''; // Set input data if needed
    
    //     const executionResult = await executeCode(code, language, input);
    //     console.log('Execution result:', executionResult);
    //     // Handle the execution result here
    // };
    const handleRunClick = async () => {
        // console.log(ext)
    };

    const handleFile = async () => {
        const file = new File([content], `code.${ext}`, {type: 'text/plain'});
        try{
            const data = new FormData();
            data.append('file', file);
            data.append('ext', ext);
            await axios.post('http://localhost:5000/upload',data,{
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            });
            alert('W');
            console.log('W');
        }
        catch(error){
            alert('L');
            console.log('L', error);
        }
    };
     

    return (
        <>
        <html>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-base.css" integrity="sha256-oIDR18yKFZtfjCJfDsJYpTBv1S9QmxYopeqw2dO96xM=" crossOrigin="anonymous" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-dark-theme.css" integrity="sha256-ygw8PvSDJJUGLf6Q9KIQsYR3mOmiQNlDaxMLDOx9xL0=" crossOrigin="anonymous" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" integrity="sha256-9mbkOfVho3ZPXfM7W8sV2SndrGDuh7wuyLjtsWeTI1Q=" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css?family=Exo+2" rel="stylesheet" />
                <link type="text/css" rel="stylesheet" href="CodeEdi.css" />
                <title>CollabCode - Free and open-source online code editor</title>
                <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
                <link rel="icon" href="./favicon.ico" type="image/x-icon" />
                <style>
                </style>
            </head>
            <body>
                <div id="site-navigation" className="ui small inverted menu">
                    <div id="site-header" className="header item">
                        <a href="/">
                            <img id="site-icon" src="./assets/judge0_icon.png" width="50" height="30"/>
                            <h2>CollabCode</h2>
                        </a>
                    </div>
                    <div className="left menu">
                        <div className="ui dropdown item site-links on-hover">
                            File <i className="dropdown icon"></i>
                            <div className="menu">
                                <a className="item" target="_blank" href="/"><i className="file code icon"></i> New File</a>
                                {/* <div className="item" onClick="downloadSource()"><i className="download icon"></i> Download</div> */}
                                <div id="insert-template-btn" className="item"><i className="file code outline icon"></i> Insert template for current language</div>
                            </div>
                        </div>
                        <div className="item borderless">
                            <select id="select-language" className="ui dropdown">
                                {/* <!-- Options dynamically generated based on the languages available --> */}
                                <option value="45" mode="UNKNOWN">Assembly (NASM 2.14.02)</option>
                                <option value="46" mode="shell">Bash (5.0.0)</option>
                                <option value="47" mode="UNKNOWN">Basic (FBC 1.07.1)</option> 
                                <option value="1011" mode="UNKNOWN">Bosque (latest)</option>  
                                <option value="75" mode="c">C (Clang 7.0.1)</option>
                                <option value="1013" mode="c">C (Clang 9.0.1)</option>
                                <option value="1001" mode="c">C (Clang 10.0.1)</option>
                                <option value="48" mode="c">C (GCC 7.4.0)</option>
                                <option value="49" mode="c">C (GCC 8.3.0)</option>
                                <option value="50" mode="c">C (GCC 9.2.0)</option>
                                <option value="51" mode="csharp">C# (Mono 6.6.0.161)</option>
                                <option value="1022" mode="csharp">C# (Mono 6.10.0.104)</option>
                                <option value="1021" mode="csharp">C# (.NET Core SDK 3.1.302)</option>
                                <option value="1023" mode="csharp">C# Test (.NET Core SDK 3.1.302, NUnit 3.12.0)</option>
                                <option value="76" mode="cpp">C++ (Clang 7.0.1)</option>
                                <option value="1014" mode="cpp">C++ (Clang 9.0.1)</option>
                                <option value="1002" mode="cpp">C++ (Clang 10.0.1)</option>
                                <option value="52" mode="cpp">C++ (GCC 7.4.0)</option>
                                <option value="53" mode="cpp">C++ (GCC 8.3.0)</option>
                                <option value="54" mode="cpp">C++ (GCC 9.2.0)</option>
                                <option value="1015" mode="cpp">C++ Test (Clang 10.0.1, Google Test 1.8.1)</option>
                                <option value="1012" mode="cpp">C++ Test (GCC 8.4.0, Google Test 1.8.1)</option>
                                <option value="1003" mode="c">C3 (latest)</option> 
                                <option value="86" mode="clojure">Clojure (1.10.1)</option>
                                <option value="77" mode="UNKNOWN">COBOL (GnuCOBOL 2.2)</option> 
                                <option value="55" mode="UNKNOWN">Common Lisp (SBCL 2.0.0)</option> 
                                <option value="56" mode="UNKNOWN">D (DMD 2.089.1)</option> 
                                <option value="57" mode="UNKNOWN">Elixir (1.9.4)</option> 
                                <option value="58" mode="UNKNOWN">Erlang (OTP 22.2)</option> 
                                <option value="44" mode="plaintext">Executable</option>
                                <option value="87" mode="fsharp">F# (.NET Core SDK 3.1.202)</option>
                                <option value="1024" mode="fsharp">F# (.NET Core SDK 3.1.302)</option>
                                <option value="59" mode="UNKNOWN">Fortran (GFortran 9.2.0)</option> 
                                <option value="60" mode="go">Go (1.13.5)</option>
                                <option value="88" mode="UNKNOWN">Groovy (3.0.3)</option> 
                                <option value="61" mode="UNKNOWN">Haskell (GHC 8.8.1)</option> 
                                <option value="62" mode="java">Java (OpenJDK 13.0.1)</option>
                                <option value="1004" mode="java">Java (OpenJDK 14.0.1)</option>
                                <option value="1005" mode="java">Java Test (OpenJDK 14.0.1, JUnit Platform Console Standalone 1.6.2)</option>
                                <option value="63" mode="javascript">JavaScript (Node.js 12.14.0)</option>
                                <option value="78" mode="kotlin">Kotlin (1.3.70)</option>
                                <option value="64" mode="lua">Lua (5.3.5)</option>
                                <option value="1006" mode="c">MPI (OpenRTE 3.1.3) with C (GCC 8.3.0)</option>
                                <option value="1007" mode="cpp">MPI (OpenRTE 3.1.3) with C++ (GCC 8.3.0)</option>
                                <option value="1008" mode="python">MPI (OpenRTE 3.1.3) with Python (3.7.3)</option>
                                <option value="1009" mode="python">Nim (stable)</option> 
                                <option value="79" mode="objective-c">Objective-C (Clang 7.0.1)</option>
                                <option value="65" mode="UNKNOWN">OCaml (4.09.0)</option> 
                                <option value="66" mode="UNKNOWN">Octave (5.1.0)</option> 
                                <option value="67" mode="pascal">Pascal (FPC 3.0.4)</option>
                                <option value="85" mode="perl">Perl (5.28.1)</option>
                                <option value="68" mode="php">PHP (7.4.1)</option>
                                <option value="43" mode="plaintext">Plain Text</option>
                                <option value="69" mode="UNKNOWN">Prolog (GNU Prolog 1.4.5)</option> 
                                <option value="70" mode="python">Python (2.7.17)</option>
                                <option value="71" mode="python">Python (3.8.1)</option>
                                <option value="1010" mode="python">Python for ML (3.7.3)</option>
                                <option value="80" mode="r">R (4.0.0)</option>
                                <option value="72" mode="ruby">Ruby (2.7.0)</option>
                                <option value="73" mode="rust">Rust (1.40.0)</option>
                                <option value="81" mode="UNKNOWN">Scala (2.13.2)</option> 
                                <option value="82" mode="sql">SQL (SQLite 3.27.2)</option>
                                <option value="83" mode="swift">Swift (5.2.3)</option>
                                <option value="74" mode="typescript">TypeScript (3.7.4)</option>
                                <option value="84" mode="vb">Visual Basic.Net (vbnc 0.0.0.5943)</option> 
                            </select>
                        </div>
                        <div className="item fitted borderless wide screen only">
                            <div className="ui input">
                                <input id="compiler-options" type="text" placeholder="Compiler options"></input>
                            </div>
                        </div>
                        <div className="item borderless wide screen only">
                            <div className="ui input">
                                <input id="command-line-arguments" type="text" placeholder="Command line arguments"></input>
                            </div>
                        </div>
                        <div id="navigation-message" className="item borderless">
                            <span className="navigation-message-text"></span>
                        </div>
                    </div>
                    <div className="">
                        <div id="">
                            More
                            <i className="dropdown icon"></i>
                            <div className="menu">
                                {/* <!-- Options dynamically generated based on more actions --> */}
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div id="site-content"></div>
                <div id="site-modal" className="ui modal">
                    <div className="header">
                        <i className="close icon"></i>
                        <span id="title"></span>
                    </div>
                    <div className="scrolling content"></div>
                    <div className="actions">
                        <div className="ui small labeled icon cancel button">
                            <i className="remove icon"></i>
                            Close (ESC)
                        </div>
                    </div>
                </div>
                <div id="site-footer">
                    <div id="editor-status-line"></div>
                    <span><a href=""></a>
                        <span id="status-line"></span>
                    </span>
                </div>
            </body>
        </html>
        <div className="App">
            <h1>Real-time Collaborative Editor</h1>
            <div className='controls'>
                <button onClick={handleBold}>
                    BOLD
                </button>
                <button onClick={handleItalic}>
                    ITALIC
                </button>
                <button onClick={handleUnderline}>
                    UNDERLINE
                </button>
                <div className="item no-left-padding borderless">
                            <button id="run-btn" onClick={handleFile}  className="ui primary labeled icon button"><i className="play icon"></i><span id="run-btn-label">Run (⌘ + ↵)</span></button>
                        </div>
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
            <div>
                <h2>Result</h2>
                <p>{result}</p>
            </div>
        </div>
        </>
    );
}

export default CodeEditor;
