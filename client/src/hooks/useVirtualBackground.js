import { useEffect, useRef } from 'react';

export const useVirtualBackground = (videoRef, backgroundOption, backgroundImage) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    let animationFrameId;
    const ctx = canvasRef.current.getContext('2d');

    const render = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video.videoWidth || !video.videoHeight) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (backgroundOption === 'blur') {
        // Draw video normally
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Draw blurred video on top with transparency
        ctx.filter = 'blur(15px)';
        ctx.globalAlpha = 0.6;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;
      } else if (backgroundOption.startsWith('preset') && backgroundImage) {
        // Draw preset background image first
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = backgroundImage;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        };
        // Prevent drawing video twice
        // So return here to avoid drawing video below
        return;
      } else {
        // 'none' or any other: just draw video
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef, backgroundOption, backgroundImage]);

  return canvasRef;
};
