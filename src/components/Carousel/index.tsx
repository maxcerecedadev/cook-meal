"use client";

import { useEffect, useState } from "react";
import { IconAngleLeft, IconAngleRight } from "@/components/icons";
import { useResponsiveBreakpoint } from "@/hooks/useResponsiveBreakpoint";

type CarouselProps<T> = {
  data: T[];
  renderCard: (item: T) => JSX.Element;
};

const Carousel = <T,>({ data, renderCard }: CarouselProps<T>) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(0);
  const { sm, md, lg, xl, xxl } = useResponsiveBreakpoint();

  useEffect(() => {
    if (sm) {
      setItemsPerView(1);
    } else if (md) {
      setItemsPerView(2);
    } else if (lg) {
      setItemsPerView(3);
    } else if (xl) {
      setItemsPerView(3);
    } else if (xxl) {
      setItemsPerView(4);
    }
  }, [sm, md, lg, xl, xxl]);

  const handleNextSlide = (): void => {
    const nextSlide = currentSlide + 1;
    const lastSlide = Math.ceil(data.length / itemsPerView) - 1;
    setCurrentSlide(nextSlide > lastSlide ? 0 : nextSlide);
  };

  const handlePrevSlide = (): void => {
    const prevSlide = currentSlide - 1;
    const lastSlide = Math.ceil(data.length / itemsPerView) - 1;
    setCurrentSlide(prevSlide < 0 ? lastSlide : prevSlide);
  };

  const startIndex = currentSlide * itemsPerView;
  const endIndex = startIndex + itemsPerView;
  const visibleData = data.slice(startIndex, endIndex);

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center px-6 py-8">
      <div className="w-full h-full grid grid-flow-col auto-cols-auto px-8 py-4 gap-2 transform ease-in-out duration-500">
        {visibleData.map((item, index) => (
          <div key={index} className="w-full h-full flex items-center justify-center">
            {renderCard(item)}
          </div>
        ))}
      </div>
      <button
        onClick={handlePrevSlide}
        className="px-2 text-primary-500 ease-in-out duration-200 absolute inset-y-0 left-2"
      >
        <IconAngleLeft />
      </button>
      <button
        onClick={handleNextSlide}
        className="px-2 text-xl text-primary-500 ease-in-out duration-200 absolute inset-y-0 right-2"
      >
        <IconAngleRight />
      </button>
    </div>
  );
};

export default Carousel;
