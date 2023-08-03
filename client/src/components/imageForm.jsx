import React, { useState } from 'react';
import NewPost from './newPost';

const App = () => {
  const [previews, setPreviews] = useState([]);

  const handlePreviewsChange = (updatedPreviews) => {
    setPreviews(updatedPreviews);
  };

  console.log({previews})

  return (
    <div className="mt-32">
      <h1>Image Uploader App</h1>
      <ImageUploader onChange={handlePreviewsChange} />
    </div>
  );
};

export default App;
