import React from 'react'
import { startNewMysteryChat } from '../api/geminiApi'
function Home() {

   const handleClick = async () => {
    try {
      const res = await startNewMysteryChat();
      console.log(res);
    } catch (error) {
      console.error("Error starting mystery chat:", error);
    }
  };
  
  return (
      <button onClick={handleClick}>Click Me</button>

  )
}

export default Home