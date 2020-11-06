import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow/Index';
import FeaturedMovie from './components/FeaturedMovie/Index';
import Header from './components/Header/Index';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista dos filmes 
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o featured
      let originals = list.filter(i => i.slug === 'originals');
      let randonChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randonChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')

      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true)

      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <div>
            <MovieRow key={key} title={item.title} items={item.items} />
          </div>
        ))}
      </section>

      <footer>
        Todos os difeitos reservados a ©Netflix clanado para estudos por Victor da Silva.
      </footer>

      {movieList.length <= 0 &&
        <div className='loading'>
          <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"></img>
        </div>
      }
    </div>
  )
}