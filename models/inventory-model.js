/******* Change Box Model ***************/
:root {
	--titleText: 'Orbitron', sans-serif;
	--smallText: 'TASA Orbiter', sans-serif;
	--teracotta: #cd6858;
	--quillGrey: #cececd;
	--brown: #5b443e;
	--tan: #cfa987;
	--darkGrey: rgb(56, 56, 56);
}
*,
*:before,
*:after {
	box-sizing: border-box;
}

body {
	width: 100%;
	background-color: white;
	padding: 0.5em;
	margin: 0 auto;
}

h1,
h2 {
	font-family: var(--titleText);
}
h3,
h4,
p,
li,
a,
figcaption {
	font-family: var(--smallText);
}

header {
	display: flex;
	justify-content: space-between;
}

a,
a:hover,
a:visited {
	text-decoration: none;
	color: black;
}

.site-name a {
	font-size: 2.5em;
}

nav ul {
	list-style: none;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	/* font-size: 1.5em; */
	padding: 0;
	max-width: 100%;
}
nav {
	margin: 0 auto;
}
nav ul li {
	background-color: var(--teracotta);
	width: 100%;
	text-align: center;
}
nav a{
	display: block;
	padding: .5em;
	width: 100%;
	height: 100%;
}
/* nav ul li a:hover{
	color: black!important;
} */
nav ul li:hover {
	background-color: rgb(214, 214, 214);
	color: black!important;
	cursor: pointer;
}

.hero {
	width: 100%;
	height: auto;
	margin: 0 auto;
	position: relative;
	/* overflow: hidden; */
	margin-bottom: 4em;
}
.hero img {
	width: 80%;
	height: auto;
	margin: 0 auto;
	display: block;
	position: relative;
}
.overlay {
	background-color: #cececd7b; /*quillGrey at a lower opacity*/
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	z-index: 2;
	padding: 0.5em;
	max-height: 100%;
	width: auto;
}
.overlay h3 {
	padding: 0;
	margin: 0.1rem;
}
.overlay button {
	margin-top: 0.5em;
	height: 45px;
	background-color: var(--teracotta);
	font-size: 1.25em;
}
.overlay button:hover {
	background-color: #e48475; /*lighter Teracotta*/
	cursor: pointer;
}
.small-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1em;
	align-items: center;
}
figure {
	margin: 0 auto;
	padding: 1em;
	background-color: var(--tan);
	width: 100%;
	height: 100%;
	text-align: center;
}
figure img {
	margin: 0 auto;
	height: 90%;
	width: auto;
}
.reviews {
	font-size: 1.25em;
}
.reviews li {
	margin: 1em;
}
#inv-detail-display {
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	justify-content: space-between;
}
#inv-detail-display img {
	width: 80%;
	height: auto;
	margin: 0 auto;
}
.description-list {
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 10px;
	list-style: none;
	font-size: 1.1em;
	/* width: 50%; */
	height: auto;
	margin: 0 auto;
}
#description{
	background-color: var(--quillGrey);
	padding: 10px;
	border-radius: 8px;
}
.description-list li {
	padding-top: 2.5%;
	width: 100%;
}
#inv-display{
	list-style: none;
}
button{
	background-color: var(--teracotta);
	color: var(--darkGrey);
	border: none;
	min-width: 48px;
	width: 120px;
	min-height: 48px;
	font-weight: bold;
	cursor: pointer;
}
button:hover{
	background-color: var(--tan);
}
.notice{
	color: rgb(45, 165, 45);
}
.error{
	color: rgb(194, 29, 29);
}
.login{
	background-color: var(--tan);
	/* width: 50%; */
	max-width: 40%;
	min-width: 20%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	border-radius: 8px;
	padding: 1em;
	font-family: var(--smallText);
	margin-bottom: 1em;
}
.login input, select{
	margin-bottom: 1em;
	height: 30px;
	border-radius: 8px;
}
.login input[type="submit"]{
	width: 40%;
	height: 35px;
	margin: 0 auto;
	margin-bottom: 1em;
	border-radius: 8px;
	background-color: var(--darkGrey);
	color: var(--quillGrey);
	cursor: pointer;
}
.login input[type="submit"]:hover{
	background-color: var(--brown);
}
.login input[type="submit"]:disabled{
	background-color: rgb(71, 22, 22);
	color: white;
}
.login input[type="submit"]:hover:disabled{
	background-color: rgb(144, 37, 37);
	color: white;
}
.login label{
	display: flex;
	flex-direction: column;
}
.login p{
	margin: 0 auto;
}
.login a{
	text-decoration: underline;
}
.button-link {
	padding: 1em;
	background-color: var(--teracotta);
	font-style: bold;
	margin-bottom: 1em;
	margin-top: 1em;
}
.button-link:hover {
	background-color: var(--tan);
}
table {
	border-collapse: collapse;
}
table a:hover{
	text-decoration: underline;
}
tr:nth-child(even){
	background-color: var(--quillGrey);
}
td, th {
	border: 1px solid var(--darkGrey);
	padding: .5em;
}
footer {
	margin-top: 3em;
}

@media (min-width: 655px) {
	html {
		background-image: url(/images/site/small_check.jpg);
	}
	body {
		width: 80%;
		margin: 0 auto;
		background-color: white;
		padding: 2em;
		margin-top: 1em;
		margin-bottom: 1em;
		border-radius: 30px;
		border: solid 5px var(--teracotta);
	}
	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3em;
	}
	.overlay {
		top: 5%;
		left: 5%;
		width: auto;
		height: auto;
	}
	.overlay h3 {
		margin: 0.25rem;
	}
	nav ul {
		list-style: none;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		font-size: 1.5em;
		padding: 0;
		max-width: 100%;
	}
	#inv-detail-display {
		flex-direction: row;
	}
	#inv-detail-display img {
		width: 50%;
		height: auto;
	}
	.description-list {
		width: 50%;
	}
}