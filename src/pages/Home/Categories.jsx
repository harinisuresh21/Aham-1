import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import { categories } from '../../data/categories';

const Categories = () => {
  return (
    <section className="py-20 bg-[#FDFAF5]">
      <Container>
        <SectionHeading 
          title="Shop by Essence" 
          subtitle="Explore our collections rooted in authentic Indian traditions."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/categories/${category.slug}`}
              className="group relative h-64 md:h-80 overflow-hidden block rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <img 
                src={category.image_url} 
                alt={category.name} 
                className="object-cover w-full h-full rounded-xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-brand-accent transition-colors">
                  {category.name}
                </h3>
                <p className="text-white/80 font-sans text-sm max-w-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Categories;
