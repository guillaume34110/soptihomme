import React from 'react';
import { sports } from './DataBase';


const SportForm = () => {
    let eventList = 0 ;

    const tcheck = (event) => {

        const inputId = event.target.id
        const inputSelect = document.getElementById(`${inputId}`)

        sports[inputId].isChecked = inputSelect.checked

        for (let i = 0; i < sports.length; i++) {
            if (sports[inputId].reqName === sports[i].reqName && sports[inputId].id !== sports[i].id) {
                sports[i].isChecked = inputSelect.checked
                const input = document.getElementById(`${i}`)
                input.checked = inputSelect.checked
            }
        }

    }

    const fullSelect = (event) => {
        const favSelect = document.querySelector('.fav-select')
        if (favSelect.checked === true) {
            favSelect.checked = false
        }

        const inputCheck = event.target.checked
        if (inputCheck === true) {
            for (let i = 0; i < sports.length; i++) {
                const input = document.getElementById(`${i}`);
                sports[i].isChecked = true;
                sports[i].fav = false;
                input.checked = true;
            }
        } else if (inputCheck === false) {
            for (let i = 0; i < sports.length; i++) {
                const input = document.getElementById(`${i}`);
                sports[i].isChecked = false;
                sports[i].fav = false;
                input.checked = false;
            }
        };

    }
    const favSelect = (event) => {
        const fullSelect = document.querySelector('.full-select')
        if (fullSelect.checked === true) {
            fullSelect.checked = false
        }


        const inputCheck = event.target.checked
        if (inputCheck === true) {
            for (let i = 0; i < sports.length; i++) {
                const input = document.getElementById(`${i}`);
                sports[i].isChecked = true;
                sports[i].fav = true;
                input.checked = true;
            }
        } else if (inputCheck === false) {
            for (let i = 0; i < sports.length; i++) {
                const input = document.getElementById(`${i}`);
                sports[i].isChecked = false;
                sports[i].fav = false;
                input.checked = false;
            }
        };
    }
    const listDisplay = () => {
       const form = document.querySelector('.form')
        if (eventList === 0){
            form.style.display = "block " ; 
            eventList ++
        }else{
            form.style.display = "none" ; 
            eventList = 0
        }

    }
    return (
        <div className="sport-form row ">
          
            <div className ="center nav-width">
                <ul>
                    <li>Afficher tous les sports <input className='full-select' type='checkbox' onClick={fullSelect}></input></li>
                    <li>Sport favoris uniquement <input className='fav-select' type='checkbox' onClick={favSelect}></input></li>
                </ul>
            </div>
            <div className ="nav-list nav-width ">
                <p onClick ={listDisplay} className="down-relative">
                selectionner des sports    <button className="arrow"></button>
                </p>
                
                <ul className ="form down-relative">
                {sports.map((sport, index) => (
                    <div key={index} className='list row'>
                        <li >{sport.value} <input id={sport.id} type='checkbox' onClick={tcheck}></input> </li>
                    </div>
                ))}
            </ul>
        </div>
        </div >
    );

}

export default SportForm;
