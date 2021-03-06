import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';

import WPAPI from 'wpapi';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import Menu from '../components/Menu/Menu';
import GlideSlider from '../components/GlideSlider/GlideSlider';

import Config from '../config';
import styles from './styles/index.module.scss';

import Re from '../public/images/re-home-page.svg';

const wp = new WPAPI({ endpoint: Config.apiUrl });
wp.globalOptions = wp.registerRoute('acf/v3/options', '/headless-settings');

const headerImageStyle = {
  marginTop: 50,
  marginBottom: 50,
};

const tokenExpired = () => {
  if (process.browser) {
    localStorage.removeItem(Config.AUTH_TOKEN);
  }
  wp.setHeaders('Authorization', '');
  Router.push('/login');
};

class Index extends Component {
  static async getInitialProps() {
    try {
      const page = await
      wp
        .pages()
        .slug('strona-glowna')
        .embed()
        .then((data) => data[0]);

      return { page };
    } catch (err) {
      if (err.data.status === 403) {
        tokenExpired();
      }
    }

    return null;
  }

  render() {
    const { headerMenu, page, acfOptions } = this.props;
    return (
      <Layout acfOptions={acfOptions}>
        <Menu menu={headerMenu} />
        <div className="relative">
          <img src={acfOptions.mobile_main} className="md:hidden pb-4" alt="" />
          <GlideSlider
            instance="index"
            className="hidden md:block"
            desktop
            options={{
              gap: 0,
              autoplay: 5000,
              animationDuration: 2000,
              type: 'carousel',
            }}
          >
            {acfOptions.main_categories.map((cat) => <img src={cat.image} key={cat.image} alt="" className="w-full my-4 md:mt-0 md:max-h-screen object-cover" />)}
          </GlideSlider>
          <Re className={[styles['re-icon'], 'absolute', 'md:w-3/12', 'h-auto'].join(' ')} />
        </div>
        {/* <div // Content of the page in WP
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
              __html: page.content.rendered,
              }}
            /> */}
      </Layout>
    );
  }
}

export default PageWrapper(Index);
