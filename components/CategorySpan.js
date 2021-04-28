import React, { Component } from 'react';
const CategoriesEnum = require("../common/categories.js")[0];

class CategorySpan extends Component {
    
    render() {
        const category = getKeyByValue(CategoriesEnum, parseInt(this.props.categoryName));
        return (
            <div className="categorySpanDiv">
                <span>
                    {category}
                </span>
            </div>
        );
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export default CategorySpan;