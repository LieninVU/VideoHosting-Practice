import React from "react";
import { useNavigate } from 'react-router-dom'

class Main extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            videos: [],
            loading: true,
            error: null,
            SERVER: props.SERVER
        };
    }

    componentDidMount(){
        this.loadVideos();
    }

    loadVideos = async () => {
        try{
            this.setState({loading: true, error: null})
            const response = await fetch(`${this.state.SERVER}/api/videos`, {
                credentials: 'include'
            });
            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            if(data.success){
                this.setState({
                    videos: data.videos,
                    loading: false,
                    error: null
                });
            } else{
                throw new Error(data.error || 'Failed to fetch videos');
            }
        } catch(error){
            console.error('Error to fetch videos: ', error);
            this.setState({
                videos: [],
                loading: false,
                error: error.message
            });
        }
    }

    handleOpenVideo = (url) =>{
        useNavigate(`/video/${url}`);

    };


    render(){
        const {videos, loading, error} =  this.state;

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
            { this.state.videos.map((video) => (
                <div className='video-item' onClick={this.handleOpenVideo(video.filename)} key={video.id}>
                
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
}

export default Main