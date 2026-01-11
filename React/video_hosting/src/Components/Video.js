import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";



function Video({SERVER}){
    const {link} = useParams();
    const [video, setVideo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    

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
    const {channelName, title, description, views, likes, videofile} = video;
    return(
        <div className='video'>
            <video src={`${videofile}`} controls>
                test
            </video>
        </div>
    )
}

export default Video;