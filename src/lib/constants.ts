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
  Twitter,
  Linkedin,
  Home,
  Briefcase,
  Info,
  Image as ImageIcon,
  BookOpen,
  User,
} from 'lucide-react';

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
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/career', label: 'Career', icon: User },
  { href: '/contact', label: 'Contact', icon: Mail },
];

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
      heroImage: 'https://picsum.photos/1200/400?random=1',
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
    description: 'Leveraging spatial data to provide powerful insights for planning and decision-making.',
    icon: Globe,
    details: {
      heroImage: 'https://picsum.photos/1200/400?random=2',
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
    description: 'Empowering the workforce with industry-relevant skills for the digital economy.',
    icon: GraduationCap,
    details: {
      heroImage: 'https://picsum.photos/1200/400?random=3',
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
    description: 'Providing strategic guidance to help businesses navigate the complexities of the market.',
    icon: Users,
    details: {
      heroImage: 'https://picsum.photos/1200/400?random=4',
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
  { name: 'Skill India', logoUrl: 'https://picsum.photos/150/50?random=11' },
  { name: 'NASSCOM', logoUrl: 'https://picsum.photos/150/50?random=12' },
  { name: 'Startup India', logoUrl: 'https://picsum.photos/150/50?random=13' },
  { name: 'Digital India', logoUrl: 'https://picsum.photos/150/50?random=14' },
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
    name: 'Aarav Patel',
    role: 'Founder & CEO',
    bio: 'A visionary leader with over 20 years of experience in the technology sector, driving innovation and strategic growth.',
    avatarUrl: 'https://picsum.photos/200/200?random=5',
  },
  {
    name: 'Diya Mehta',
    role: 'Chief Technology Officer',
    bio: 'An expert in network architecture and geospatial technologies, Diya leads our technical teams to deliver excellence.',
    avatarUrl: 'https://picsum.photos/200/200?random=6',
  },
  {
    name: 'Rohan Joshi',
    role: 'Head of Business Development',
    bio: 'Rohan is dedicated to building strong client relationships and identifying new opportunities for strategic partnerships.',
    avatarUrl: 'https://picsum.photos/200/200?random=7',
  },
   {
    name: 'Isha Gupta',
    role: 'Director of Skill Development',
    bio: 'Passionate about education and empowerment, Isha designs and oversees our impactful training programs.',
    avatarUrl: 'https://picsum.photos/200/200?random=8',
  },
];


export const CONTACT_DETAILS = {
  address: "123 Tech Park, Innovation Drive, Bangalore, 560100, India",
  phone: "+91 98765 43210",
  email: "contact@digitalindian.co.in",
};

export const SOCIAL_LINKS = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
];
