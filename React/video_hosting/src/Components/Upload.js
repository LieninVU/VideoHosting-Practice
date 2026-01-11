import React from "react";


const Upload = ({server}) => {

    alert(server)
    const url = server + '/api/upload';
    return(
        <div className='upload'>
            <form action={url} method='post' encType="multipart/form-data">
                <input type='text'name="title" placeholder='Input the Title of the Video' required />
                <input type='text'name="description" placeholder='Input the Description of the Video' required/>
                <label htmlFor='videoFile'>Upload The Video</label>
                <input type='file' id='videoFile' name='videoFile' accept='video/*' required/>
                <button type='submit'>Upload</button>

            </form>

        </div>


    );
}

export default Upload;