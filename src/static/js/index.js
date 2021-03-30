const nextButton = document.querySelector('#nextArr');
const prevButton = document.querySelector('#prevArr');

let glide = new Glide('.glide', {
    type: 'carousel',
    focusAt: 'center',
    perView: 1,
    keyboard: true
})

nextButton.addEventListener('click', function (event) {
    event.preventDefault();

    glide.go('>');
})

prevButton.addEventListener('click', function (event) {
    event.preventDefault();

    glide.go('<');
})

glide.mount()

if (document.querySelector('.header-burger')) {
    document.querySelector('.header-burger').addEventListener('click', () => {
        document.querySelector('.header-burger').classList.toggle('active')
        document.querySelector('.mobile__header').classList.toggle('closed')
    })
}

if (document.querySelectorAll('.mobile__header-nav a').length) {
    document.querySelectorAll('.mobile__header-nav a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.header-burger').classList.remove('active')
            document.querySelector('.mobile__header').classList.add('closed')
        })
    })
}