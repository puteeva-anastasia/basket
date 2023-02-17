"use strict";

//Объект корзины
let basket = {

	//Карточки товаров
	cardElems: document.querySelectorAll('.card'),

	//Кнопка "Открытия / Закрытия корзины"
	buttonBasket: document.querySelector('.button__basket'),

	//Кнопки "В корзину"
	cardInBasketElems: document.querySelectorAll('.card__in-basket'),

	//Корзина
	inBasketEl: document.querySelector('.in-basket'),

	//Элемент "Тело таблицы"
	tbody: null,

	//Инициализация корзины
	init() {
		//Устанавливаем товарам значения id и data-атрибута quantity
		this.setProductValues();
		//Выводим уведомление в корзине, что она пустая
		this.informBasketIsEmpty();
		//Инициализация обработчиков событий
		this.initEventHandlers();
	},

	//Устанавливаем товарам значения id и data-атрибута quantity
	setProductValues() {
		//Проходим циклом по всем товарам и каждому товару устанавливаем id и data-атрибут quantity равный 0 (количество товара в корзине 0)
		for (let i = 0; i < this.cardElems.length; i++) {
			this.cardElems[i].setAttribute('id', i + 1);
			this.cardElems[i].dataset.quantity = "0";
		}
	},

	//Выводим уведомление в корзине, что она пустая
	informBasketIsEmpty() {
		this.inBasketEl.innerHTML = '<span class="in-basket__empty">В данный момент в корзине нет товаров, чтобы они появились, пожалуйста, нажмите кнопку "В корзину"</span>';
	},

	//Инициализация обработчиков событий
	initEventHandlers() {
		/* При клике на кнопку "Открытия / Закрытия корзины", в зависимости от того есть ли у элемента корзины класс close, 
		добавляем или удаляем его */
		this.buttonBasket.addEventListener('click', () => this.inBasketEl.classList.toggle('close'));

		//Проходим циклом по всем кнопкам "В корзину" и отслеживаем, на какую из кнопок был совершен клик
		for (let i = 0; i < this.cardInBasketElems.length; i++) {
			this.cardInBasketElems[i].addEventListener('click', event => this.cardInBasketClickHandler(event));
		}
	},

	cardInBasketClickHandler(event) {
		//Находим карточку товара, у которой нажали кнопку "В корзину"
		let cardEl = event.target.parentElement;

		/* Проверяем, есть ли товары в корзине. Если корзина пустая, то удаляем надпись, что корзина пустая и создаем таблицу, иначе выходим 
		из функции */
		this.checkIsProductsInBasket();

		//Меняем количество товара
		this.changeQuantityProducts(cardEl);

		/* Проверяем, есть ли добавленный товар в корзине. Если есть меняем количество товара и выходим из функции, 
		иначе создаем строку с товаром */
		this.checkIsAddedProductInBasket(cardEl);

		//Считаем общую сумму товаров
		this.calculateTotalSumma();
	},

	/* Проверяем, есть ли товары в корзине. Если корзина пустая, то удаляем надпись, что корзина пустая и создаем таблицу, иначе выходим 
	из функции */
	checkIsProductsInBasket() {
		for (let i = 0; i < this.cardElems.length; i++) {
			//Проверяем у каждого товара атрибут data-quantity, если он больше нуля, значит корзина не пустая, уходим из функции
			if (this.cardElems[i].dataset.quantity > 0) {
				return;
			}
		}

		//Удаляем надпись, что корзина пустая
		this.deleteInformBasketIsEmpty();

		//Создаем таблицу
		this.createTable();
	},

	//Удаляем надпись, что корзина пустая
	deleteInformBasketIsEmpty() {
		document.querySelector('.in-basket__empty').remove();
	},

	//Создаем таблицу
	createTable() {
		//Создаем элемент "Таблица"
		let tableEl = document.createElement('table');
		//Добавляем таблицу в конец класса .in-basket
		this.inBasketEl.appendChild(tableEl);

		//Создаем элемент "Шапка таблицы"
		let theadEl = document.createElement('thead');
		//Добавляем таблицу в конец класса .in-basket
		tableEl.appendChild(theadEl);

		//Создаем первую строку
		let firstTrEl = document.createElement('tr');
		//Добавляем в конец элемента thead первую строку
		theadEl.appendChild(firstTrEl);
		//Заполяем первую строку таблицы ячейками
		firstTrEl.insertAdjacentHTML('afterbegin', '<th>ID</th><th>Имя</th><th>Цена</th><th>Количество</th><th></th>');

		//Создаем элемент "Тело таблицы"
		this.tbodyEl = document.createElement('tbody');
		//Добавляем в конец таблицы table элемент tbody
		tableEl.appendChild(this.tbodyEl);

		//Создаем элемент "Подвал таблицы"
		let tfootEl = document.createElement('tfoot');
		//Добавляем в конец таблицы table элемент tfoot
		tableEl.appendChild(tfootEl);
		//Добавляем в конец элемента tfoot строку "Итого"
		tfootEl.insertAdjacentHTML('beforeend', '<tr><td class="bold" colspan="2">Итого:</td><td colspan="3" id="totalSumma"></td></tr>');
	},

	//Меняем количество товара
	changeQuantityProducts(cardEl) {
		//Меняем data-атрибут quantity товара, добавлением к нему 1
		cardEl.dataset.quantity = +(cardEl.dataset.quantity) + 1;
	},

	//Проверяем, есть ли добавленный товар в корзине
	checkIsAddedProductInBasket(cardEl) {
		//Проходим циклом по всем товарам из корзины
		for (let i = 0; i < this.tbodyEl.children.length; i++) {
			/* Если текст в первой колонке совпадает с id карты, на которую нажали, то значит этот товар в корзине уже есть и нужно
			изменить только ячейку с количеством в этой строке и выйти из функции */
			if (this.tbodyEl.children[i].cells[0].innerText == cardEl.id) {
				this.tbodyEl.children[i].cells[3].innerText = cardEl.dataset.quantity;
				return;
			}
		}

		//Если товара нет в корзине, создаем строку в корзине с нашим товаром
		this.createLineWithProduct(cardEl);
	},

	//Создаем строку в корзине с нашим товаром
	createLineWithProduct(cardEl) {

		//Создаем пустую строку, которую в дальнейшем заполним ячейками
		let cells = '';

		//Создаем строку
		let trEl = document.createElement('tr');

		//Добавляем в конец элемента tbody строку
		this.tbodyEl.appendChild(trEl);

		//Создаем строку, заполненную ячейками
		for (let i = 0; i < 5; i++) {
			cells += '<td></td>';
		}

		//После открывающегося тега tr добавляем ячейки
		trEl.insertAdjacentHTML('afterbegin', cells);

		//Заполняем каждую ячейку таблицы
		trEl.cells[0].innerText = cardEl.id; //id товара
		trEl.cells[1].innerText = cardEl.querySelector('.card__name').textContent.trim(); //название товара
		trEl.cells[2].innerText = cardEl.querySelector('.card__price-count').textContent.trim(); //цена товара
		trEl.cells[3].innerText = cardEl.dataset.quantity; //количество товара
		trEl.cells[4].innerHTML = `<button type="button" class="in-basket__clear"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></button>`; //кнопка удаления товара

		//Вешаем слушатель события клик на кнопку удаления товара
		this.clickEventListenerOnClear();
	},

	//Считаем общую сумму товаров
	calculateTotalSumma() {

		//Общая сумма товаров
		let totalSumma = 0;

		//Считаем общую сумму товаров, для этого проходимся по всем товарам в корзине
		for (let i = 0; i < this.tbodyEl.children.length; i++) {
			//Умножаем цену на количество
			totalSumma += this.tbodyEl.children[i].cells[2].innerText * this.tbodyEl.children[i].cells[3].innerText;
		}

		//Выводим полученную сумму в элемент #totalSumma
		document.querySelector('#totalSumma').innerHTML = `${totalSumma} <span class="bold">₽</span>`;
	},

	//Вешаем слушатель события клик на кнопку удаления товара
	clickEventListenerOnClear() {
		//Находим все кнопки с классом in-basket__clear
		let inBasketClearElems = document.querySelectorAll('.in-basket__clear');

		//Находим последнюю кнопку с классом in-basket__clear
		let lastInBasketClearEl = inBasketClearElems[inBasketClearElems.length - 1];

		//Вешаем слушатель события на последнюю кнопку с классом in-basket__clear
		lastInBasketClearEl.addEventListener('click', event => this.inBasketClearClickHandler(event));
	},

	inBasketClearClickHandler(event){
		//Текущая строка, в которой изменяем количество товаров
		let currentLine = event.currentTarget.parentElement.parentElement;

		//Уменьшаем количество товаров
		this.reduceQuantityProducts(currentLine);
		
		//Удаляем текущую строку
		this.removeCurrentLine(currentLine);

		//Считаем общую сумму товаров
		this.calculateTotalSumma();

		//Проверяем, если хоть у одной карточки товара на странице data-атрибут quantity больше 0, то тогда выходим из функции
		for(let i = 0; i < this.cardElems.length; i++){
			if(this.cardElems[i].dataset.quantity > 0){
				return;
			}
		}

		//Удаляем таблицу
		this.removeTable();

		//Добавляем надпись, что корзина пустая
		this.informBasketIsEmpty();
	},

	//Уменьшаем количество товаров
	reduceQuantityProducts(currentLine){
		//Проходим по всем карточкам товаров
		for(let i = 0; i < this.cardElems.length; i++){
			/* Если id товара в текущей строке в корзине совпадает с id карточки товара на странице, то тогда у этой карточки товара 
			изменяем data-атрибут quantity, а также изменяем количество товара в корзине */
			if(currentLine.cells[0].innerText == this.cardElems[i].id){
				this.cardElems[i].dataset.quantity = this.cardElems[i].dataset.quantity - 1;
				currentLine.cells[3].innerText = currentLine.cells[3].innerText - 1;
			}
		}
	},

	//Удаляем текущую строку
	removeCurrentLine(currentLine){
		//Если количество товара в текущей строке равно 0, удаляем эту строку
		if (currentLine.cells[3].innerText == 0){
			currentLine.remove();
		}
	},

	//Удаляем таблицу
	removeTable(){
		this.inBasketEl.querySelector('table').remove();
	}
};

//Инициализация корзины
basket.init();