import { useHttp } from '../../hooks/http.hook';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { heroCreated } from '../../actions'

const HeroesAddForm = () => {

    const [heroName, setHeroName] = useState('');
    const [heroDescription, setHeroDescription] = useState('');
    const [heroElement, setHeroElement] = useState('');
    const {filters, filtersLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const onSubmitHandler = (event) => {
        event.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescription,
            element: heroElement
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, 'good'))
            .then(dispatch(heroCreated(newHero)))
            .catch(error => console.log(error))
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Loading items</option>
        } else if (status === "error") {
            return <option>Error Loading</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({name, label}) =>  {
                if (name === "all") return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">New hero's name</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="What's my name?"
                    value={heroName}
                    onChange={(event) => setHeroName(event.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Description   </label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="What can I do?"
                    style={{"height": '130px'}}
                    value={heroDescription}
                    onChange={(event) => setHeroDescription(event.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Select hero item</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(event) => setHeroElement(event.target.value)}>
                    <option >I own the element...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;