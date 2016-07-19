import React from 'react';
const {Component} = React;
import {fetchJson, getDescription} from '../../utils';

if (process.env.WEBPACK) require('./Product.css');

class Product extends Component {
  constructor(props) {
    super(props);

    this.changeDescription = this.changeDescription.bind(this);
    this.nextDescription = this.nextDescription.bind(this);
    this.prevDescription = this.prevDescription.bind(this);

    this.state = {
      descriptions: [],
      title: '',
      currentDescIndex: 0,
      expanded: true,
    };
  }

  componentDidMount() {
    // depending on the nature of the data, I also could have fetched this server-side
    // for simplicity just loading it as the component mounts
    fetchJson('/api/data', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // normalise the response a little so I can rely on descriptions being an array
        this.setState({
          title: data.title || '',
          descriptions: data.content || [],
        });
      }
    });
  }

  nextDescription() {
    if (this.state.currentDescIndex >= this.state.descriptions.length - 1) return;
    this.changeDescription(1);
  }

  prevDescription() {
    if (this.state.currentDescIndex <= 0) return;
    this.changeDescription(-1);
  }

  changeDescription(direction) {
    this.setState({
      currentDescIndex: this.state.currentDescIndex + direction,
    });
  }

  getPrevTitle() {
    const {descriptions, currentDescIndex} = this.state;
    if (currentDescIndex <= 0) return '';
    return descriptions[currentDescIndex - 1].title;
  }

  getNextTitle() {
    const {descriptions, currentDescIndex} = this.state;
    if (this.state.currentDescIndex >= descriptions.length - 1) return '';
    return descriptions[currentDescIndex + 1].title;
  }

  render() {
    const {descriptions, currentDescIndex, title, expanded} = this.state;

    if (!descriptions || !descriptions.length) return null;

    const nextButtonText = this.getNextTitle();
    const prevButtonText = this.getPrevTitle();

    const description = getDescription(descriptions, currentDescIndex);

    // conditional display logic handled in inline styles
    // could also have used classnames to add/remove classes
    const styles = {
      toggleButton: {
        transform: `rotateX(${expanded ? '180' : '0'}deg)`,
      },
      body: {
        height: expanded ? '' : 0,
      },
      productImg: {
        display: !description.thumbnail ? 'none' : '',
      },
      prevButton: {
        display: !prevButtonText ? 'none' : '',
      },
      nextButton: {
        display: !nextButtonText ? 'none' : '',
      },
    };

    return (
      <div className="product">
        <div className="product__title-bar">

          {/* would normally use an icon font or do something like this: https://medium.com/@david.gilbertson/icons-as-react-components-de3e33cb8792#.xx4ghg8ep */}
          <svg className="icon" fill="#468100" height="24" viewBox="0 0 24 24" width="24">
            <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
          </svg>

          <h1 className="product__title">{title}</h1>

          <button
            className="product__title-bar__arrow"
            style={styles.toggleButton}
            onClick={() => {
              this.setState({
                expanded: !this.state.expanded,
              });
            }}
          >▼</button>
        </div>

        <div className="product__body" style={styles.body}>
          <img className="product__image" style={styles.productImg} src={`/images/${description.thumbnail}`} />

          <div
            className="product__desc"
            // In production would use sanitize-html or a similar module
            dangerouslySetInnerHTML={{__html: description.description}}
          ></div>
        </div>

        <div className="product__footer-nav">
          <div className="product__button-wrapper product__button-wrapper--prev">
            <a
              className="product__button product__button--prev"
              onClick={this.prevDescription}
              style={styles.prevButton}
            >
              {prevButtonText}
            </a>
          </div>

          <div className="product__button-wrapper product__button-wrapper--next">
            <a
              className="product__button product__button--next"
              onClick={this.nextDescription}
              style={styles.nextButton}
            >
              {nextButtonText}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
