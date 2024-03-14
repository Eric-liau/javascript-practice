const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* Declaring the array of image filenames */

/* Declaring the alternative text for each image file */

/* Looping through images */
for(let i = 1; i <= 5; i++){
    const newImage = document.createElement('img');
    newImage.setAttribute('src', `images/pic${ i }.jpg`);
    newImage.setAttribute('alt', 'test');
    newImage.addEventListener('click', function(){
        displayedImage.setAttribute('src', this.getAttribute('src'));
    });
    thumbBar.appendChild(newImage);
}

btn.addEventListener('click', function(){
    if(this.getAttribute('class') === 'dark'){
        this.textContent = 'Lighten';
        this.setAttribute('class', 'light')
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    }
    else{
        this.textContent = 'Darken';
        this.setAttribute('class', 'dark');
        overlay.style = 'background-color : rgba(0,0,0,0)';
    }
});


/* Wiring up the Darken/Lighten button */
