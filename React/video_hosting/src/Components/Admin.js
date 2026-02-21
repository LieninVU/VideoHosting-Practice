import React from "react";
import { useState, useEffect } from "react";


const Admin = ({SERVER}) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [videos, setVideos] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [content, setContent] = useState('videos');

    useEffect(() => {
        checkAdminRights();
        alert(isAdmin);
    }, []);

    useEffect(() => {
        if(isAdmin){
            loadVideos();
            loadAccounts();
            
        }
    }, [isAdmin])


    const checkAdminRights = async () => {
        const response = await fetch(`${SERVER}/api/isAdmin`, {
            method: 'GET',
            credentials:'include'
        })
        if(!response.ok){console.log(`Error of checking Admin rights\nStatus:${response.status} Message:${response.statusText}`)}
        const result = await response.json();
        if(result.isAdmin){setIsAdmin(true);}
        else{setIsAdmin(false);}
    }


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


    const handleDeleteVideo = async (index) => {
        const response = await fetch(`${SERVER}/api/deleteVideo/${videos[index].id}`,{
            method: 'POST',
            credentials: 'include'
        })
        if(!response.ok){console.log(`Error, You Don\`t Delete Video\nStstus: ${response.status}\nMessage: ${response.statusText}`)}
        const result = await response.json();
        if(result.success){
            let newVideos = [];
            videos.map((video, i) => {
                if(i != index){
                    newVideos.push(video);
                }
            })
            setVideos(newVideos);
        }
    }

    const handleDeleteAccount = async (index) =>{
        const response = await fetch(`${SERVER}/api/deleteAccount/${accounts[index].id}`, {
            method: 'POST',
            credentials: 'include'
        })
        if(!response.ok){console.log(`Error, You Don\`t Delete Account\nStstus: ${response.status}\nMessage: ${response.statusText}`)}
        const result = await response.json();
        if(result.success){
            let newAccounts = [];
            accounts.map((account, i) => {
                if(i != index){
                    newAccounts.push(account);
                }
            })
            setAccounts(newAccounts);
        }
    }


    return(
        <div className='admin'>
            { isAdmin ? 
                <div>
                    <button type='button' className='button' onClick={() => handleAllVidoes()}>All Videos</button>
                    <button type='button' className='button' onClick={() => handleAllAccounts()}>All Accounts</button>
                    {content === 'videos' && (
                        <div>
                            <table className='table'>
                                <thead className='table'>
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
                                </thead >
                                <tbody className='table'>
                                    {videos.map((video, index) => (
                                        <tr key={index}>
                                            <td>{video.id}
                                                <div className='hide-menu'>
                                                    <button className='button' onClick={() => handleDeleteVideo(index)}>DELETE</button>
                                                    <button className='button'>DELETE</button>
                                                </div>
                                            </td>
                                            <td>{video.userId}</td>
                                            <td>{video.title}</td>
                                            <td>{video.description}</td>
                                            <td>{video.viewsCount}</td>
                                            <td>{video.likesCount}</td>
                                            <td>{video.filename}</td>
                                            <td>{video.username}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                {content === 'accounts' && (
                    <div>
                    <table className='table'>
                        <thead className='table'>
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
                        <tbody className='table'>
                            {accounts.map((account, index) => (
                                <tr key={index}>
                                    <td>{account.id}
                                        <div className='hide-menu'>
                                            <button className='button' onClick={() => handleDeleteAccount(index)}>DELETE</button>
                                            <button className='button'>DELETE</button>
                                        </div>
                                    </td>
                                    <td>{account.login}</td>
                                    <td>{account.password}</td>
                                    <td>{account.username}</td>
                                    <td>{account.admin}</td>
                                    <td>{account.created_at}</td>
                                    <td>{account.updated_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           )}
           </div> : <div>You Are Not An Admin</div>}
        </div>
        
    
    )
}


export default Admin;