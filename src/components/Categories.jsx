import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero_pastel.png';
import kurtiImg from '../assets/kurti.png';
import lehengaImg from '../assets/lehenga.png';
import { useAnimation } from '../context/AnimationContext';

gsap.registerPlugin(ScrollTrigger);

const Categories = () => {
    const sectionRef = useRef(null);
    const columnsRef = useRef([]);
    const titleRef = useRef(null);

    const collections = [
        { name: 'Bridal', image: heroBg },
        { name: 'Festive', image: kurtiImg },
        { name: 'Modern', image: lehengaImg },
    ];

    const { hasPlayedIntro } = useAnimation();

    useEffect(() => {
        if (hasPlayedIntro) {
            gsap.set(columnsRef.current, { y: 0, opacity: 1 });
            gsap.set(titleRef.current, { y: 0, opacity: 1 });
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
            }
        });

        tl.fromTo(titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
            .fromTo(columnsRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out",
                },
                "-=0.5"
            );
    }, [hasPlayedIntro]);

    return (
        <section ref={sectionRef} className="w-full bg-[#FFF7E4] py-16">
            <div className="px-8 mb-12 text-center">
                <h2 ref={titleRef} className="text-3xl md:text-5xl font-serif text-black uppercase tracking-widest">
                    Our Latest Collections
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 md:h-[80vh] md:min-h-[600px] gap-[1px]">
                {collections.map((col, index) => (
                    <Link
                        to={`/category/${col.name.toLowerCase()}`}
                        key={col.name}
                        ref={el => columnsRef.current[index] = el}
                        className="relative group overflow-hidden h-[70vh] md:h-full cursor-pointer block"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                            style={{ backgroundImage: `url(${col.image})` }}
                        ></div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                            <h3 className="text-3xl md:text-4xl font-serif tracking-wide mb-4 transform translate-y-0 transition-transform duration-500 group-hover:-translate-y-2">
                                {col.name}
                            </h3>
                            <span className="text-xs uppercase tracking-[0.25em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 border-b border-white pb-1">
                                View Collection
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Categories;
