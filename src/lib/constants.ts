
import {
  TowerControl,
  Globe,
  GraduationCap,
  Users,
  type LucideIcon,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
  Home,
  Briefcase,
  Info,
  Image as ImageIcon,
  BookOpen,
  User,
  LayoutDashboard,
} from 'lucide-react';
import partner1 from '../assets/carousel/partner1.jpg';
import partner2 from '../assets/carousel/partner2.jpeg';
import partner3 from '../assets/carousel/partner3.png';
import partner4 from '../assets/carousel/partner4.jpeg';
import partner5 from '../assets/carousel/partner5.jpeg';
import partner6 from '../assets/carousel/partner6.png';
import partner7 from '../assets/carousel/partner7.jpeg';
import partner8 from '../assets/carousel/partner8.jpeg';
import partner9 from '../assets/carousel/partner9.jpeg';
import partner10 from '../assets/carousel/partner10.png';
import partner11 from '../assets/carousel/partner11.jpeg';
import partner12 from '../assets/carousel/partner12.jpeg';
import service1 from '../assets/service1.jpg'
import service2 from '../assets/service 2.jpg'
import service3 from '../assets/service 3.jpg'
import service4 from '../assets/service 4.jpg'
import homet1 from '../assets/homet1.jpg'
import homet2 from '../assets/homet2.jpg'
import homet3 from '../assets/homet3.jpg'
import homet4 from '../assets/homet4.jpg'




type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  subLinks?: {
    href: string;
    label: string;
  }[];
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { 
    href: '/services', 
    label: 'Services', 
    icon: Briefcase,
    subLinks: [
      { href: '/services/telecom-infrastructure', label: 'Telecom Infrastructure' },
      { href: '/services/geospatial-gis', label: 'Geospatial & GIS' },
      { href: '/services/skill-development', label: 'Skill Development' },
      { href: '/services/business-consultancy', label: 'Business Consultancy' },
    ]
  },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/gallery', label: 'Life at Digital Indian', icon: ImageIcon },
  { href: '/career', label: 'Career', icon: User },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export const ADMIN_NAV_LINK: NavLink = {
  href: '/admin/dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard,
};


type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  details: {
    heroImage: string;
    heroTitle: string;
    heroSubtitle: string;
    sections: {
      title: string;
      content: string;
      points?: string[];
    }[];
  };
};

export const SERVICES: Service[] = [
  {
    slug: 'telecom-infrastructure',
    title: 'Telecom Infrastructure',
    description: 'Designing, deploying, and maintaining robust and scalable telecom networks.',
    icon: TowerControl,
    details: {
      heroImage: service1,
      heroTitle: 'Advanced Telecom Infrastructure',
      heroSubtitle: 'Building the backbone of modern communication with cutting-edge technology and expertise.',
      sections: [
        {
          title: 'Our Comprehensive Approach',
          content: 'We provide end-to-end solutions for telecom infrastructure, ensuring high availability, performance, and security. Our services cover everything from initial planning and design to implementation and ongoing maintenance.'
        },
        {
          title: 'Core Offerings',
          content: 'Our expertise spans a wide range of telecom solutions:',
          points: [
            '5G Network Deployment and Optimization',
            'Fiber Optic Network (FTTx) Design and Implementation',
            'Wireless Network Solutions (Wi-Fi, LTE)',
            'Data Center and Core Network Architecture',
            'Network Security and Compliance'
          ]
        }
      ]
    }
  },
  {
    slug: 'geospatial-gis',
    title: 'Geospatial & GIS',
    description: 'Advanced utility mapping, remote sensing, and spatial data analytics for informed decision-making.',
    icon: Globe,
    details: {
      heroImage: service2,
      heroTitle: 'Intelligent Geospatial & GIS Solutions',
      heroSubtitle: 'Transforming complex location data into actionable intelligence for strategic advantage.',
      sections: [
        {
          title: 'Unlocking Spatial Insights',
          content: 'Our GIS services help organizations visualize, analyze, and interpret geographical data to understand relationships, patterns, and trends. We enable data-driven decisions that improve efficiency and outcomes.'
        },
        {
          title: 'What We Do',
          content: 'We offer a full suite of GIS services, including:',
          points: [
            'Spatial Data Collection and Management',
            'Custom GIS Application Development',
            'Remote Sensing and Image Analysis',
            '3D City Modeling and Visualization',
            'Location-Based Analytics and Business Intelligence'
          ]
        }
      ]
    }
  },
  {
    slug: 'skill-development',
    title: 'Skill Development',
    description: 'Industry-focused training programs in telecom and GIS with government and corporate partnerships.',
    icon: GraduationCap,
    details: {
      heroImage: service3,
      heroTitle: 'Future-Ready Skill Development',
      heroSubtitle: 'Bridging the talent gap with targeted training programs and certifications.',
      sections: [
        {
          title: 'Building a Skilled Workforce',
          content: 'In partnership with government and industry bodies, we deliver high-impact training programs that equip individuals with the skills needed to succeed in today\'s technology-driven job market.'
        },
        {
          title: 'Our Training Programs',
          content: 'We focus on high-demand technology areas:',
          points: [
            'Certified Telecom and 5G Professionals',
            'GIS and Geospatial Analytics Training',
            'Full-Stack Web and Mobile Development',
            'Data Science and Machine Learning',
            'Corporate and Upskilling Programs'
          ]
        }
      ]
    }
  },
  {
    slug: 'business-consultancy',
    title: 'Business Consultancy',
    description: 'Comprehensive startup support including handholding, seed funding, and business compliance services.',
    icon: Users,
    details: {
      heroImage: service4,
      heroTitle: 'Strategic Business Consultancy',
      heroSubtitle: 'Driving transformation and growth with expert advice and innovative strategies.',
      sections: [
        {
          title: 'Your Partner in Growth',
          content: 'Our consultancy services are designed to help you overcome challenges, seize opportunities, and achieve sustainable growth. We combine deep industry knowledge with a forward-thinking approach.'
        },
        {
          title: 'Areas of Expertise',
          content: 'We provide consultancy in:',
          points: [
            'Digital Transformation Strategy',
            'Market Entry and Expansion',
            'Process Optimization and Automation',
            'Technology Roadmapping and Adoption',
            'Startup Mentorship and Incubation'
          ]
        }
      ]
    }
  },
];

export const METRICS = [
  { value: '15+', label: 'Years Experience' },
  { value: '500+', label: 'Projects Completed' },
  { value: '200+', label: 'Satisfied Clients' },
];

export const PARTNERS = [
    { name: 'Partner 1', logo: partner1 },
    { name: 'Partner 2', logo: partner2 },
    { name: 'Partner 3', logo: partner3 },
    { name: 'Partner 4', logo: partner4 },
    { name: 'Partner 5', logo: partner5 },
    { name: 'Partner 6', logo: partner6 },
    { name: 'Partner 7', logo: partner7},
    { name: 'Partner 8', logo: partner8 },
    { name: 'Partner 9', logo: partner9 },
    { name: 'Partner 10', logo: partner10 },
    { name: 'Partner 11', logo: partner11 },
    { name: 'Partner 12', logo: partner12 }
];

export const TESTIMONIALS = [
  {
    quote: "Digital Indian's expertise in telecom infrastructure was pivotal for our network expansion. Their professionalism and execution were flawless.",
    name: 'Ravi Sharma',
    company: 'CEO, ConnectNet',
  },
  {
    quote: 'The GIS solutions they provided have completely transformed our urban planning process. Invaluable insights and a great team to work with.',
    name: 'Priya Singh',
    company: 'Director, Urban Development Authority',
  },
  {
    quote: 'Thanks to their skill development program, our team is now equipped with the latest 5G technologies. A truly impactful partnership.',
    name: 'Anil Kumar',
    company: 'HR Head, TechWave Solutions',
  },
];

export const TEAM_MEMBERS = [
  {
    name: 'Santanu Das',
    role: 'Founder & CEO',
    bio: 'A visionary leader with over 20 years of experience in the technology sector, driving innovation and strategic growth.',
    avatarUrl: '',
  },
  {
    name: 'Tapas Chakroborty',
    role: 'CFO',
    bio: 'An expert in network architecture and geospatial technologies, Diya leads our technical teams to deliver excellence.',
    avatarUrl: '',
  },
  {
    name: 'Sandy Dias',
    role: 'HR',
    bio: 'Rohan is dedicated to building strong client relationships and identifying new opportunities for strategic partnerships.',
    avatarUrl: '',
  },
   {
    name: 'M.K Sukumar',
    role: 'Technical Head',
    bio: 'Passionate about education and empowerment, Isha designs and oversees our impactful training programs.',
    avatarUrl: 'https://picsum.photos/200/200?random=8',
  },
];


export const CONTACT_DETAILS = {
  address: "EN-9, Salt Lake, Sec-5, Kolkata-700091",
  phone: "+91 7908735132",
  email: "info@digitalindian.co.in",
};

export const SOCIAL_LINKS = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/digitalindian.org/' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/digitalindian/?originalSubdomain=in' },
    { name: 'Youtube', icon: Youtube, href: 'https://www.youtube.com/channel/UCwLQPtIouPQA_pfWsxAr1Aw' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/digital_indian16' },
];
