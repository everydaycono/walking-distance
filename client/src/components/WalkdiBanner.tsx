'use client';
import { FC, useEffect, useState } from 'react';
import bannerImg1 from '../../public/images/walkdi-banner1.png';
import bannerImg2 from '../../public/images/walkdi-banner2.png';
import Image from 'next/image';
interface WalkdiBannerProps {}

const images = [bannerImg1, bannerImg2];

const WalkdiBanner: FC<WalkdiBannerProps> = ({}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrevClick = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
  };

  const handleNextClick = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex]);
  return (
    <div className="relative">
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2"
        onClick={handlePrevClick}
      >
        Previous
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2"
        onClick={handleNextClick}
      >
        Next
      </button>
      <div className="w-full h-64 overflow-hidden relative">
        <div
          className="h-full flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transitionTimingFunction: 'ease-in-out',
            transitionProperty: 'transform'
          }}
        >
          {images.map((image, index) => (
            <Image
              alt={`${image}-${index}`}
              src={image}
              key={index}
              className="w-full h-full bg-cover bg-center"
            />
          ))}
          {/* 무한 반복을 위한 복제 이미지 */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${images[0]})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default WalkdiBanner;
