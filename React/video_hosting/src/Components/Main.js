import React from "react";
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";

function Main({SERVER}){
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try{
            setLoading(true);
            setError(null);
            const response = await fetch(`${SERVER}/api/videos`, {
                credentials: 'include'
            });
            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            if(data.success){
                setLoading(false);
                setError(null);
                setVideos(data.videos)
            } else{
                throw new Error(data.error || 'Failed to fetch videos');
            }
        } catch(error){
            console.error('Error to fetch videos: ', error);
            setLoading(false);
            setError(error.message);
            setVideos([])
        }
    }

    const handleOpenVideo = (url) =>{
        navigate(`/video/${url}`);
    };

    if(loading){
        return(
            <div className='loading'>
                <span>Videos is Loading</span>
                <span className='signature'>please wait</span>
            </div>
        );
    }
    if(error){
        return(
            <div className='error'>{error}</div>
        );
    }

    if(videos.length === 0){
        return(
            <div className='empty'>
                <span>Now We Hane Not An Any Videos</span>
            </div>
        );
    }


    return(
        <div className='grid-container'>main Content
        { videos.map((video, index) => (
            <div className='video-item' onClick={() => handleOpenVideo(video.filename)} key={index}>
            
                {/* <video scr={`${SERVER}/api`} */}
                <a id='title'>{video.title}</a>
                <span id='description'>{video.description}</span>
                <span id='channel-name'>{video.username}</span>
                <span id='views-count'>{video.viewsCount}</span>
            
            </div>
        ))}
            

        </div>
    )
    
}

export default Main