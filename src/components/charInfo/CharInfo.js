import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.charId !== this.props.charId) {
      this.updateChar();
    }
  }

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }
    this.onCharLoading();

    this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError);
  };

  onCharLoading = () => {
    this.setState({ loading: true, error: false });
  };

  onCharLoaded = (char) => {
    this.setState({ char, loading: false, error: false });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    const { char, loading, error } = this.state;

    const skeleton = !(char || loading || error) ? <Skeleton /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
      <div className='char__info'>
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, thumbnail, description, homepage, wiki, comics } = char;
  return (
    <>
      <div className='char__basics'>
        <img
          src={thumbnail}
          alt={name}
        />
        <div>
          <div className='char__info-name'>{name}</div>
          <div className='char__btns'>
            <a
              href={homepage}
              className='button button__main'>
              <div className='inner'>homepage</div>
            </a>
            <a
              href={wiki}
              className='button button__secondary'>
              <div className='inner'>Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className='char__descr'>{description}</div>
      <div className='char__comics'>Comics:</div>
      <ul className='char__comics-list'>
        {comics.length === 0 ? (
          'There is no comics with this character'
        ) : (
          <Comics comics={comics} />
        )}
      </ul>
    </>
  );
};

const Comics = ({ comics }) => {
  const content = comics.map((item, i) => {
    const { name /* resourceURI */ } = item;
    return (
      <li
        key={i}
        className='char__comics-item'>
        {name}
        {/* <a href={resourceURI}>{name}</a> */}
      </li>
    );
  });
  return <>{content}</>;
};

export default CharInfo;
