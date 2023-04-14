import React from 'react';

import Heading from './Heading';
import Github from './Github';
import Features from './Features';
import Technology from './Technology';
import Disclaimer from './Disclaimer';

import './aboutSection.scss';

function AboutSection({ activeSection }) {
  return (
    <section
      className={`about rightside ${activeSection === 'about' ? 'showsection' : ''}`}
      id="about"
    >
      <Heading />
      <div className="rightside__container">
        <Github />
        <Features />
        <Technology />
        <Disclaimer />
      </div>
    </section>
  );
}

export default React.memo(AboutSection);
