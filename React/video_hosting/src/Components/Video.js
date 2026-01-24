import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from '../AuthContext';


function Video({SERVER}){
    const {link} = useParams();
    const [video, setVideo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ localLikes, setLocalLikes] = useState(0);
    const { userLogin, checkAuthStatus } = useAuth();
    
    

    useEffect(() => {
        loadVideo(link);
    }, [link]);

    useEffect(() => {
        if(video.likes !== undefined){
            setLocalLikes(video.likes);
        }
    }, [video.likes]);

    const loadVideo = async (link) => {
        try{
            const response = await fetch(`${SERVER}/api/video/${link}`);
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
              }
            const result = await response.json();
            console.log('API Response:', result);
            if (result.success && result.video) {
                setLoading(false);
                setError(null);
                setVideo(result.video); // Используем result.video, а не result
            } else {
                throw new Error(result.error || 'Failed to load video');
            }
            
        }catch(error){
            console.log(error.message);
            setLoading(false);
            setError(error.message);
            setVideo({})
        }

    }

    
    
    if(loading){
        return(
            <div className='loading'>
                <span>Video is Loading</span>
                <span className='signature'>please wait</span>
            </div>
        )
    }
    if(error){
        return(
            <div className='error'>{error}</div>
        );
    }
    console.log('Video object:', video);

    const addLike = async (videofile) =>{
        try{
            const response = await fetch(`${SERVER}/api/addLike/${fileName}`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
            });
            if(!response.ok){
                let errorText;
                // Попробуем получить JSON
                errorText = await response.text();
               
                throw new Error(`Ошибка, вы не поставили лайк:  ${response.status}: ${errorText}`);
            }
            setLocalLikes(prevLikes => prevLikes + 1);
            console.log('Like was set');
        } catch(error){
            console.log('Unsuccessful like set: ', error.message);
            alert('Unsuccessful like set: ' + error.message)
        }
    }

    const {channelName, title, description, views, likes, videofile, fileName} = video;
    
    return(
        <div className='video'>
            <video className='player' src={`${videofile}`} controls>
                test
            </video>
            <div className='video-info'>
                <div className='left-info'>
                    <div className='video-title'>{title}</div>
                    <div className='video-channelName'>CHANNEL: {channelName}</div>
                    <div className='views-video'>VIEWS: {views}</div>
                    <div className='video-description'>DESCRIPTION: <br/>{description}</div>
                </div>
                <div className='right-info'>
                    <button className='video-likes' onClick={() => addLike(videofile)}>LIKES: {localLikes}</button>
                </div>
            </div>
        </div>
    )
}

export default Video;