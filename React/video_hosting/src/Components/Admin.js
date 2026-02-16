import React from "react";
import { useState, useEffect } from "react";


const Admin = (SERVER) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [videos, setVideos] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [content, setContent] = useState('videos');

    useEffect(async() => {
        const response = await fetch(`${SERVER}/api/isAdmin`, {
            method: 'GET',
            credentials:'include'
        })
        if(!response.ok){console.log(`Error of checking Admin rights\nStatus:${response.status} Message:${response.statusText}`)}
        const result = await response.json();
        if(result.isAdmin){setIsAdmin(true);}
        else{setIsAdmin(false);}
    }, []);

    useEffect(async() => {
        if(isAdmin){
            const videos = await loadVideos();
            const accounts = await loadAccounts();
            setVideos(videos);
            setAccounts(accounts);
        }
    }, [isAdmin])


    const loadVideos = async () =>{
        const response = await fetch(`${SERVER}/api/videos`, {
            method: 'GET',
            credentials: 'include'
        })
        if(!response.ok){console.log(`Error of Loading Videos\nStatus:${response.status} Message:${response.statusText}`)}
        const result = await response.json();
        if(result.success){setVideos(result.videos);}
        else{
            setVideos([]);
            console.log(`Error of Loading Videos\nStatus:${response.status} Message:${response.statusText}`);
        }
    }

    const loadAccounts = async () => {
        const response = await fetch(`${SERVER}/api/accounts`, {
            method: 'GET',
            credentials: 'include'
        })
        if(!response.ok){console.log(`Error of Loading Accounts\nStatus:${response.status} Message:${response.statusText}`)}
        const result = await response.json();
        if(result.success){setAccounts(result.accounts);}
        else{
            setAccounts([]);
            console.log(`Error of Loading Videos\nStatus:${response.status} Message:${response.statusText}`);
        }
    }

    const handleAllVidoes = () => {
        setContent('videos');
    }
    const handleAllAccounts = () => {
        setContent('accounts');
    }

    return(
        <div className='admin'>
            <button type='button' onClick={() => handleAllVidoes()}>All Videos</button>
            <button type='button' onClick={() => handleAllAccounts()}>All Accounts</button>
            {content === 'videos' && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Video ID</th>
                                <th>User ID</th>
                                <th>Video Title</th>
                                <th>Video Description</th>
                                <th>Video View Count</th>
                                <th>Video Like Count</th>
                                <th>Video Filename</th>
                                <th>Account Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video, index) => (
                                <tr key={index}>
                                    <td>{video.id}</td>
                                    <td>{video.userId}</td>
                                    <td>{video.title}</td>
                                    <td>{video.description}</td>
                                    <td>{video.viewsCount}</td>
                                    <td>{video.likesCount}</td>
                                    <td>{video.filename}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
           {content === 'accounts' && (
             <div>
             <table>
                 <thead>
                     <tr>
                         <th>Account ID</th>
                         <th>Account Login</th>
                         <th>Account Password</th>
                         <th>Account Username</th>
                         <th>Account is Admin</th>
                         <th>Account Created At</th>
                         <th>Account Updated At</th>
                     </tr>
                 </thead>
                 <tbody>
                     {accounts.map((account, index) => (
                         <tr key={index}>
                             <td>{account.id}</td>
                             <td>{account.login}</td>
                             <td>{account.password}</td>
                             <td>{account.username}</td>
                             <td>{account.admin}</td>
                             <td>{account.createdAt}</td>
                             <td>{account.updatedAt}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
           )}
        </div>
    )
}


export default Admin;