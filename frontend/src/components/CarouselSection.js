import React from 'react';
import Slider from 'react-slick';
import './CarouselSection.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarouselSection = () => {
  const slides = [
    {
      img: "https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg",
      title: "Consult Doctors Anywhere",
      desc: "Experience healthcare from home.",
    },
    {
      img: "https://s3-eu-west-1.amazonaws.com/intercare-web-public/wysiwyg-uploads%2F1698752331464-pexels-tessy-agbonome-18828741-min.jpg",
      title: "Manage Appointments Easily",
      desc: "Book or cancel with a few clicks.",
    },
    {
      img: "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg",
      title: "Secure Medical Records",
      desc: "Access reports anytime.",
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    arrows: false,
    adaptiveHeight: false,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div 
              className="carousel-slide"
              style={{
                backgroundImage: `url(${slide.img})`,
              }}
            >
              <div className="carousel-overlay">
                <h2>{slide.title}</h2>
                <p>{slide.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarouselSection;