import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './spinner';
import PropTypes from 'prop-types'


export default class News extends Component {
    static defaultProps = {
        country:'in',
        pageSize:8,
        category:'general'
    }

    static propTypes = {
        name: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }

    constructor() {
        super();
        console.log("Hello i am a constructer from news components")
        this.state = {
            articles: [],
            loading: false,
            page: 1,
        }
    }
    async componentDidMount() {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=bb4e1dec42a74eb0baea1e4d22eb64de&page=1&pageSize=${this.props.pageSize}`
        this.setState({loading: true})
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData);
        this.setState({ 
            articles: parsedData.articles , 
            totalResults: parsedData.totalResults ,
            loading: false ,
         })
    }

    handleNextClick = async()=>{
        if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=bb4e1dec42a74eb0baea1e4d22eb64de&page= ${ this.state.page + 1}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url);
        let parsedData = await data.json()
        this.setState({
            page: this.state.page +1,
            articles: parsedData.articles,
            loading: false
        })
    }
}

    handlePreviousClick = async()=>{
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=bb4e1dec42a74eb0baea1e4d22eb64de&page= ${ this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url);
        let parsedData = await data.json()
        console.log(parsedData);
        this.setState({
            page: this.state.page - 1,
            articles: parsedData.articles,
            loading: false
        })
    }

    render() {
        return (
            <div className='container my-3'>
                <h1 className="text-center">NewsMonkey - Top Headlines</h1>
                    {this.state.loading && <Spinner/>}
                <div className="row">
                    {!(this.state.loading) && this.state.articles.map((element) => {
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title ? element.title.slice(0, 45) : "There is no title available"} description={element.description ? element.description.slice(0, 88) : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in odio eu velit aliquet cursus"} imageUrl={element.urlToImage ||"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png"} newsUrl={element.url} />
                        </div>
                    })}
                </div>
                <div className="container d-flex justify-content-between">

                        <button disabled = {this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick}>&#8592;Previous</button>

                        <button disabled = {this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                    
                </div>
            </div>
        )
    }

}
