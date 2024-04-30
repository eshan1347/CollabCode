import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './CodeEdi.css';
import axios from 'axios'
// import AWS from 'aws-sdk';
import 'tailwindcss/tailwind.css';



const socket = io('http://13.126.228.132:5000');

function CodeEditor() {
    const [content, setContent] = useState('');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [result, setResult] = useState('');
    const [ext, setExt] = useState('py');
    const [file, setFile] = useState(null);
    const [output, setOutput] = useState('');
    const [ps, setPs] = useState('');

    useEffect(() => {

        // setExt('py');

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

        socket.on('output', (output) => {
            console.log('Output : ' + output)
            setOutput(output);
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

    const handleSelect = (event) => {
        console.log('Selected Language: ' + event.target.value);
        setExt(event.target.value);
        console.log("Set ext: " , event.target.value)
        socket.emit('ext', event.target.value);
        // console.log('Selected Language: ' + ext);
    };

    const PSdict = {
        '1': `
        1. Minimum Number of Operations to Make Array XOR Equal to K
        
        You are given a 0-indexed integer array nums and a positive integer k.
        
        You can apply the following operation on the array any number of times:
        
            Choose any element of the array and flip a bit in its binary representation. Flipping a bit means changing a 0 to 1 or vice versa.
        
        Return the minimum number of operations required to make the bitwise XOR of all elements of the final array equal to k.
        
        Note that you can flip leading zero bits in the binary representation of elements. For example, for the number (101)2 you can flip the fourth bit and obtain (1101)2.`,
        '2': `
        2. Count Elements With Maximum Frequency

        You are given an array nums consisting of positive integers.

        Return the total frequencies of elements in nums such that those elements all have the maximum frequency.

        The frequency of an element is the number of occurrences of that element in the array.

        

        Example 1:

        Input: nums = [1,2,2,3,1,4]
        Output: 4
        Explanation: The elements 1 and 2 have a frequency of 2 which is the maximum frequency in the array.
        So the number of elements in the array with maximum frequency is 4.

        Example 2:

        Input: nums = [1,2,3,4,5]
        Output: 5
        Explanation: All elements of the array have a frequency of 1 which is the maximum.
        So the number of elements in the array with maximum frequency is 5.
        `,
        '3': `
        3. Climbing Stairs

        You are climbing a staircase. It takes n steps to reach the top.

        Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

        

        Example 1:

        Input: n = 2
        Output: 2
        Explanation: There are two ways to climb to the top.
        1. 1 step + 1 step
        2. 2 steps

        Example 2:

        Input: n = 3
        Output: 3
        Explanation: There are three ways to climb to the top.
        1. 1 step + 1 step + 1 step
        2. 1 step + 2 steps
        3. 2 steps + 1 step
        `,
        '4': `
        4. Largest Odd Number in String

        You are given a string num, representing a large integer. Return the largest-valued odd integer (as a string) that is a non-empty substring of num, or an empty string "" if no odd integer exists.

        A substring is a contiguous sequence of characters within a string.

        

        Example 1:

        Input: num = "52"
        Output: "5"
        Explanation: The only non-empty substrings are "5", "2", and "52". "5" is the only odd number.

        Example 2:

        Input: num = "4206"
        Output: ""
        Explanation: There are no odd numbers in "4206".

        Example 3:

        Input: num = "35427"
        Output: "35427"
        Explanation: "35427" is already an odd number.
        `,
        '5': `
        5. K Inverse Pairs Array

        For an integer array nums, an inverse pair is a pair of integers [i, j] where 0 <= i < j < nums.length and nums[i] > nums[j].

        Given two integers n and k, return the number of different arrays consisting of numbers from 1 to n such that there are exactly k inverse pairs. Since the answer can be huge, return it modulo 109 + 7.

        

        Example 1:

        Input: n = 3, k = 0
        Output: 1
        Explanation: Only the array [1,2,3] which consists of numbers from 1 to 3 has exactly 0 inverse pairs.

        Example 2:

        Input: n = 3, k = 1
        Output: 2
        Explanation: The array [1,3,2] and [2,1,3] have exactly 1 inverse pair.
        `,
        '6': `
        6. Sort Characters By Frequency

        Given a string s, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.

        Return the sorted string. If there are multiple answers, return any of them.

        

        Example 1:

        Input: s = "tree"
        Output: "eert"
        Explanation: 'e' appears twice while 'r' and 't' both appear once.
        So 'e' must appear before both 'r' and 't'. Therefore "eetr" is also a valid answer.

        Example 2:

        Input: s = "cccaaa"
        Output: "aaaccc"
        Explanation: Both 'c' and 'a' appear three times, so both "cccaaa" and "aaaccc" are valid answers.
        Note that "cacaca" is incorrect, as the same characters must be together.
        `,
        '7': `
        7. Reorder List

        You are given the head of a singly linked-list. The list can be represented as:

        L0 → L1 → … → Ln - 1 → Ln

        Reorder the list to be on the following form:

        L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

        You may not modify the values in the list's nodes. Only nodes themselves may be changed.

        

        Example 1:

        Input: head = [1,2,3,4]
        Output: [1,4,2,3]

        Example 2:

        Input: head = [1,2,3,4,5]
        Output: [1,5,2,4,3]

        `
    }

    const handlePS = (event) => {
        console.log('Selected PS: ', event.target.value);
        setPs(PSdict[event.target.value]);
        console.log(PSdict[event.target.value]);
    }

    const handleFile = async () => {
        socket.emit('code',content);
        const file = new File([content], `code.${ext}`, {type: 'text/plain'});
        try{
            const data = new FormData();
            data.append('file', file);
            data.append('ext', ext);
            await axios.post('http://13.126.228.132:5000/upload',data,{
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
                {/* <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" /> */}
                {/* <link rel="icon" href="./favicon.ico" type="image/x-icon" /> */}
                <style>
                </style>
            </head>
            <body>
                <div id="site-navigation" className="ui small inverted menu">
                    <div id="site-header" className="header item">
                        <a href="/">
                            {/* <img id="site-icon" src="./assets/judge0_icon.png" width="50" height="30"/> */}
                            <h2>CollabCode</h2>
                        </a>
                    </div>
                    <div className="left menu">
                        <div className="ui dropdown item site-links on-hover">
                            File <i className="dropdown icon"></i>
                            <div className="menu">
                                <a className="item" target="_blank" href="/"><i className="file code icon"></i> New File</a>
                                <div className="item" onClick="downloadSource()"><i className="download icon"></i> Download</div>
                                <div id="insert-template-btn" className="item"><i className="file code outline icon"></i> Insert template for current language</div>
                            </div>
                        </div>
                        <div className="item borderless">
                            <select id="select-language" className="ui dropdown" value={ext} onChange={handleSelect} >
                                {/* <!-- Options dynamically generated based on the languages available --> */}
                                <option value="45" mode="UNKNOWN">Assembly (NASM 2.14.02)</option>
                                <option value="46" mode="shell">Bash (5.0.0)</option>
                                <option value="47" mode="UNKNOWN">Basic (FBC 1.07.1)</option> 
                                <option value="1011" mode="UNKNOWN">Bosque (latest)</option>  
                                <option value="c" mode="c">C (Clang 7.0.1)</option>
                                <option value="c" mode="c">C (Clang 9.0.1)</option>
                                <option value="c" mode="c">C (Clang 10.0.1)</option>
                                <option value="c" mode="c">C (GCC 7.4.0)</option>
                                <option value="c" mode="c">C (GCC 8.3.0)</option>
                                <option value="c" mode="c">C (GCC 9.2.0)</option>
                                <option value="51" mode="csharp">C# (Mono 6.6.0.161)</option>
                                <option value="1022" mode="csharp">C# (Mono 6.10.0.104)</option>
                                <option value="1021" mode="csharp">C# (.NET Core SDK 3.1.302)</option>
                                <option value="1023" mode="csharp">C# Test (.NET Core SDK 3.1.302, NUnit 3.12.0)</option>
                                <option value="cpp" mode="cpp">C++ (Clang 7.0.1)</option>
                                <option value="cpp" mode="cpp">C++ (Clang 9.0.1)</option>
                                <option value="cpp" mode="cpp">C++ (Clang 10.0.1)</option>
                                <option value="cpp" mode="cpp">C++ (GCC 7.4.0)</option>
                                <option value="cpp" mode="cpp">C++ (GCC 8.3.0)</option>
                                <option value="cpp" mode="cpp">C++ (GCC 9.2.0)</option>
                                <option value="cpp" mode="cpp">C++ Test (Clang 10.0.1, Google Test 1.8.1)</option>
                                <option value="cpp" mode="cpp">C++ Test (GCC 8.4.0, Google Test 1.8.1)</option>
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
                                <option value="java" mode="java">Java (OpenJDK 13.0.1)</option>
                                <option value="java" mode="java">Java (OpenJDK 14.0.1)</option>
                                <option value="java" mode="java">Java Test (OpenJDK 14.0.1, JUnit Platform Console Standalone 1.6.2)</option>
                                <option value="js" mode="javascript">JavaScript (Node.js 12.14.0)</option>
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
                                <option value="py" mode="python">Python (2.7.17)</option>
                                <option value="py" mode="python">Python (3.8.1) [Default]</option>
                                <option value="py" mode="python">Python for ML (3.7.3)</option>
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
                    <div className="item borderless">
                            <select id="select-language" className="ui dropdown"  onChange={handlePS} >
                                {/* <!-- Options dynamically generated based on the languages available --> */}
                                <option>None</option>
                                <option value="1" >PS1</option>
                                <option value="2" >PS2</option>
                                <option value="3" >PS3</option> 
                                <option value="4" >PS4</option>  
                                <option value="5" >PS5</option>
                                <option value="6" >PS6</option>
                                <option value="7" >PS7</option>
                            </select>
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
        </div>
            <div>
            <h1 className='text-left pl-8'>Problem Statements</h1>
            <p className='pl-8 text-lg'><pre>Select problem statement from the dropdown above</pre></p>
                <p className='text-xl'><pre>{ps}</pre></p>
            </div>
            <h1 className='pb-6 pl-8'>Code: </h1>
            <textarea
                value={content}
                onChange={handleEdit}
                rows={10}
                cols={50}
                className="w-2/3 pl-8"
                style={{
                    fontWeight: bold ? 'bold' : 'normal',
                    fontStyle: italic ? 'italic' : 'normal',
                    textDecoration: underline ? 'underline' : 'none'
                }}
            />
            <div className='pt-8 pl-8'>
                <h2>Result</h2>
                <p>
                    <pre>{output}</pre>
                    </p>
            </div>
        
        </>
    );
}

export default CodeEditor;
