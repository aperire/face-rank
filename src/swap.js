import React, { useState, useEffect } from 'react';
import "./swap.css"

function ImageSwapper() {
  const [currentImage, setCurrentImage] = useState('');
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    getNextImage();
  }, []);

  const handleOkClick = () => {
    getNextImage()
    sendVote({
        "currentImage": currentImage,
        "vote": "up"
    });
  };

  const handleNoClick = () => {
    getNextImage()
    sendVote({
        "currentImage": currentImage,
        "vote": "down"
    });
  };

  const getNextImage = () => {
    fetch("https://2c96-104-204-138-4.ngrok.io/fetch")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCurrentImage(`https://2c96-104-204-138-4.ngrok.io/images/${data.img}`)
        setCurrentText(data.text)
      })
      .catch(error => console.log(error));
  }

  const sendVote = (response) => {
    fetch('https://2c96-104-204-138-4.ngrok.io/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ response })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Vote submitted successfully:', data);
      })
      .catch((error) => {
        console.error('Error submitting vote:', error);
      });
  };
  

  return (
    <div className="container">
      <h1>Vote!</h1>
      <img src={currentImage} alt="img" className="image"/>
      <h4>{currentText}</h4>
      <div className="button-container">
        <button className="ok-button" onClick={handleOkClick}>Up</button>
        <button className="no-button" onClick={handleNoClick}>Down</button>
      </div>
    </div>
  );
}

export default ImageSwapper;

