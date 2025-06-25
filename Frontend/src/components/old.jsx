import React from 'react'
import home from './icons/home.svg'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, EffectCoverflow, Pagination, } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

const Cards = () => {
    return (
        <div>

            <div className='my-6 flex justify-center text-[#F7F7F7] '>
                <Swiper modules={[Navigation, EffectCoverflow, Pagination]}
                    effect={'coverflow'} grabCursor={true} spaceBetween={0}
                    centeredSlides={true} loop={true} slidesPerView={'auto'}
                    coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
                    pagination={{ el: '.swiper-pagination', clickable: true }}
                    navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', clickable: true }}
                    className='swiper_container '
                    style={{ overflow: 'hidden' }}>

                    <SwiperSlide className="">
                        <div className='w-[120px] h-[120px] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-[0px_4px_6px_0px_#F7F7F7] cursor-pointer'>
                            <div className='icon'>
                                <img src={home} alt="Ship now" />
                            </div>
                            <div className='heading'>
                                <span className='font-semibold'>Ship Now</span>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="">
                        <div className='w-[120px] h-[120px] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-[0px_4px_6px_0px_#F7F7F7] cursor-pointer'>
                            <div className='icon'>
                                <img src={home} alt="Ship now" />
                            </div>
                            <div className='heading'>
                                <span className='font-semibold'>Ship Now</span>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="">
                        <div className='w-[120px] h-[120px] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-[0px_4px_6px_0px_#F7F7F7] cursor-pointer'>
                            <div className='icon'>
                                <img src={home} alt="Ship now" />
                            </div>
                            <div className='heading'>
                                <span className='font-semibold'>Ship Now</span>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="">
                        <div className='w-[120px] h-[120px] bg-[#009688] flex flex-col justify-center items-center gap-2 rounded-lg shadow-[0px_4px_6px_0px_#F7F7F7] cursor-pointer'>
                            <div className='icon'>
                                <img src={home} alt="Ship now" />
                            </div>
                            <div className='heading'>
                                <span className='font-semibold'>Ship Now</span>
                            </div>
                        </div>
                    </SwiperSlide>

                    <div className="slider-controler ">
                        <div className="swiper-button-prev slider-arrow">
                            <ion-icon name="arrow-back-outline"></ion-icon>
                        </div>
                        <div className='swiper-button-next slider-arrow'>
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>

                </Swiper>

                {/**/}



            </div>



        </div>
    )
}

export default Cards
