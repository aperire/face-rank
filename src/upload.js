import React, { useState } from 'react';

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('text', text);
    console.log(formData);
    try {
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status === 200) {
        window.alert("Uploaded!")
      }
      console.log('Upload successful:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Post Your Image!</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <label htmlFor="image-input" style={{ marginBottom: '10px', fontWeight: 'bold' }}>Image:</label>
        <input
          type="file"
          id="image-input"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        {preview && (
          <img
            src={preview}
            alt="Image preview"
            style={{ maxWidth: '200px', marginTop: '10px' }}
          />
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="text-input" style={{ marginBottom: '10px', fontWeight: 'bold' }}>Text:</label>
        <input
          type="text"
          id="text-input"
          value={text}
          onChange={handleTextChange}
          style={{ width: '100%', padding: '10px', fontSize: '18px', borderRadius: '5px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
        />
      </div>
      <button
        type="submit"
        style={{ padding: '10px', fontSize: '18px', fontWeight: 'bold', borderRadius: '20px', border: 'none', backgroundColor: '#1DA1F2', color: 'white', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }}
      >
        Submit
      </button>
    </form>
  );
  
}

export default ImageUploader;
