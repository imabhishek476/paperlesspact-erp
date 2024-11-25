import { Button } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const Carousel = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
    };

    const renderSlides = () => {
        const slideIndexes = Array.from({ length: images.length }, (_, index) => (currentSlide + index) % images.length);
        {console.log(slideIndexes)}
        return slideIndexes.map((index) => (
            <img key={index} src={images[index].link} alt={`Slide ${index + 1}`} />
        ));
    };

    return (
        <div className="relative flex flex-row gap-5">
            <Button className='absolute top-[45%] bg-transparent left-[-25px]' onClick={prevSlide} isIconOnly>
                <ChevronLeft />
            </Button>
            <div className="grid grid-cols-4 gap-5 transition-all duration-700">{renderSlides()}</div>
            <Button isIconOnly className='absolute top-[45%] right-[-25px] bg-transparent' onClick={nextSlide}>
                <ChevronRight />
            </Button>
        </div>
    );
};

export default Carousel;
