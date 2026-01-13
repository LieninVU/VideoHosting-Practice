import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from '../AuthContext';


function Video({SERVER}){
    const {link} = useParams();
    const [video, setVideo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userLogin, checkAuthStatus } = useAuth();
    
    

    useEffect(() => {
        loadVideo(link);
    }, [link]);

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

    // const addLike = async (videofile) =>{
    //     try{
    //         const response = await fetch(`${SERVER}/api/addlike/${userLogin}/${videofile}`);
    //         if(!response.ok){
    //             throw new Error(`Ошибка, вы не поставили лайк:  ${response.status}: ${response.statusText}`);
    //         }
    //         console.log('Like was set');
    //     } catch(error){
    //         console.log('Unsucsessful like set: ', error.message);
    //     }
    // }

    const {channelName, title, description, views, likes, videofile} = video;
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
                    <button className='video-likes' onClick={"() => addLike(videofile)"}>LIKES: {likes}</button>
                </div>
            </div>
        </div>
    )
}

export default Video;