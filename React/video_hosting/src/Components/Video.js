import React from "react";



class Video extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            video: [],
            loading: true,
            error: null,
            url: '',
            file: [],
            SERVER: this.props.SERVER
        }
    }
    

    componentDidCatch(){
        const querryString = window.location.search;
        const videoLink = URLSearchParams(querryString).get('link');
        this.loadVideo(videoLink);
    }

    loadVideo = async (link) => {
        try{

            const video = await fetch(`${this.state.SERVER}/video/${link}`);
        }catch(error){
            
        }

    }
}

export default Video;