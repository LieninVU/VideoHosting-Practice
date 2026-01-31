import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';

function Profile({SERVER}) {
    const { userId: urlUserId } = useParams();
    const [userId, setUserId] = useState(urlUserId || '');
    const [username, setUsername] = useState('');
    const [uploadedVideos, setUploadedVideos] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);

    useEffect(() => {
        // Обновляем userId, если он изменился в URL
        if (urlUserId && urlUserId !== userId) {
            setUserId(urlUserId);
        }
    }, [urlUserId]);

    useEffect(() => {
        // Загружаем данные при монтировании и при изменении userId
        loadInitialData();
    }, [userId]);

    const loadInitialData = async () => {
        if (!userId) return;

        await getVideos();
        await getProfileInfo();
    };

    const getVideos = async () => {
        try{
            const [responseLike, responseUploaded] = await Promise.all([
                fetch(`${SERVER}/api/getVideoLikes/${userId}`),
                fetch(`${SERVER}/api/getVideoUploaded/${userId}`)
            ]);
            if (!responseLike.ok) throw new Error(`Ошибка лайков: ${responseLike.status}`);
            if (!responseUploaded.ok) throw new Error(`Ошибка загруженных: ${responseUploaded.status}`);
            const likeVideos = await responseLike.json();
            const uploadedVideos = await responseUploaded.json();

            setLikedVideos(likeVideos.data);
            setUploadedVideos(uploadedVideos.data);
        } catch(error){
            console.log(error.message);
            alert(`Ошибка загруженных: ${error.message}`)
        }
    }

    const getProfileInfo = async () => {
        try{
            const respone = await fetch(`${SERVER}/api/getProfileInfo/${userId}`);
            if(!respone.ok){
                const errorText = await respone.text();
                throw new Error(`Error Failed Receiving of profile info: ${errorText}`);
            }
            const profileInfo = await respone.json();

            setUsername(profileInfo.username);
        } catch(error){
            console.log(error.message);
            alert(`Error Failed Receiving of profile info ${error.message}`)
        }
    }

    return(
        <div className='profilePage'>
            <div className='profile'>{username}</div>
            <a>Your`s Videos</a>
            <div className='horisonal-lent'>
                {uploadedVideos.map((video, index) =>(
                    <Link className='video-item' to={`/video/${video.filename}`} key={index}>
                        <a id='title'>{video.title}</a>
                        <span id='description'>{video.description}</span>
                        <span id='channel-name'>{video.username}</span>
                    </Link>
                ))}
            </div>
            <a>Your`s Likes</a>
            <div className='horisonal-lent'>
                {likedVideos.map((video, index) =>(
                    <Link className='video-item' to={`/video/${video.filename}`} key={index}>
                        <a id='title'>{video.title}</a>
                        <span id='description'>{video.description}</span>
                        <span id='channel-name'>{video.username}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Profile;