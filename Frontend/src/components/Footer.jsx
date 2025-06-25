import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import facebook from './icons/facebook.svg';
import instagram from './icons/instagram.svg';
import linkedin from './icons/linkedin.svg';
import logo from './logo/SWIFTLOGIXFooter.png';

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '0px 0px -100px 0px' });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="w-full bg-[#009688] text-[#F7F7F7]"
    >
      <div className='flex flex-wrap justify-center px-6 py-10 gap-8'>

        {/* Company Info */}
        <div className='flex flex-col items-center w-full sm:w-1/2 lg:w-1/4 gap-6'>
          <img src={logo} alt="SwiftLogix Logo" className="w-24 sm:w-32 lg:w-56 object-contain" />
          <div className='text-center'>
            <div className='text-[20px] font-semibold underline underline-offset-2 mb-2'>Headquarter</div>
            <p>SwiftLogix, Al Hamra 262</p>
            <p>Lahore, Punjab, 05450</p>
            <p>Pakistan</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className='flex flex-col w-full sm:w-1/2 lg:w-1/5 gap-4'>
          <h1 className='text-[20px] font-semibold underline underline-offset-2'>Quick Links</h1>
          <ul className='flex flex-col gap-2'>
            <NavLink to="/rider-login"><li className='hover:text-[#FF7043] cursor-pointer'>Get Started as Rider</li></NavLink>
            <NavLink to="/login"><li className='hover:text-[#FF7043] cursor-pointer'>Get Started as Customer</li></NavLink>
            <NavLink to="/schedule-a-ship"><li className='hover:text-[#FF7043] cursor-pointer'>Customizable Delivery</li></NavLink>
            <NavLink to="/insurane-policy"><li className='hover:text-[#FF7043] cursor-pointer'>Insurance Policy</li></NavLink>
            <NavLink to="/payment-methods"><li className='hover:text-[#FF7043] cursor-pointer'>Payment Methods</li></NavLink>
          </ul>
        </div>

        {/* Business Solutions */}
        <div className='flex flex-col w-full sm:w-1/2 lg:w-1/5 gap-4'>
          <h1 className='text-[20px] font-semibold underline underline-offset-2'>Business Solutions</h1>
          <ul className='flex flex-col gap-2'>
            <NavLink to="/freelance-rider-program"><li className='hover:text-[#FF7043] cursor-pointer'>Freelance Rider Program</li></NavLink>
          </ul>
        </div>

        {/* Need Help */}
        <div className='flex flex-col w-full sm:w-1/2 lg:w-1/5 gap-4'>
          <h1 className='text-[20px] font-semibold underline underline-offset-2'>Need Help?</h1>
          <ul className='flex flex-col gap-2'>
            <NavLink to="/live-track"><li className='hover:text-[#FF7043] cursor-pointer'>Track Your Shipment</li></NavLink>
            <NavLink to="/file-claim"><li className='hover:text-[#FF7043] cursor-pointer'>File a Claim</li></NavLink>
            <li className='hover:text-[#FF7043] cursor-pointer'>
              <a href="https://cdn.botpress.cloud/webchat/v2.5/shareable.html?configUrl=https://files.bpcontent.cloud/2025/05/25/16/20250525161042-D665MSI3.json" target='_blank' rel="noopener noreferrer">Talk with SwiftBot</a>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className='flex flex-col w-full sm:w-1/2 lg:w-1/5 gap-4 items-center'>
          <h1 className='text-[20px] font-semibold underline underline-offset-2'>Connect with Us</h1>
          <div className='flex gap-4'>
            <img src={facebook} alt="Facebook" className='w-8 cursor-pointer transition-transform duration-300 hover:scale-110' />
            <img src={instagram} alt="Instagram" className='w-8 invert cursor-pointer transition-transform duration-300 hover:scale-110' />
            <img src={linkedin} alt="LinkedIn" className='w-8 invert cursor-pointer transition-transform duration-300 hover:scale-110' />
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className='w-full text-center py-4 border-t border-[#F7F7F7] text-sm'>
        &copy; 2025 SwiftLogix. All Rights Reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
