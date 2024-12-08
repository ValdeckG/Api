Banco library

TABELAS
users - name, address, email, phone_number, password, lending_count
books - title, author, gender, year, is_lending
books_management - FR bookid, FR userid, return_date, is_returned, management_date, type, lendingid, devolution_date

ORM - sequelize

CONTROLLERS 

USERS

register - Registra o usuario com senha criptografada
login - Realiza login no usuario cadastrado recebendo um token de acesso
middleware - validateToken -> valida o token se e valido
getAll - Lista todos os usuarios

BOOKS

create - Registra um livro
getall- Lista os livros cadastrados
update - Atualiza informaçoes de um livro cadastrado
destroy - Delete um livro cadastrado

BOOKS MANAGEMENT

create - contador de emprestimo com limite = 5, data de devolucao 7 dias apos emprestimo, type recebe "emprestimo" e "devolucao", quando emprestado atualiza o livro(is_lending) para true e quando emprestado adiciona mais um no contado de emprestimo e devolucao diminui um
getAll - Lista os emprestimos
update - atualiza os dados de um emprestimo
destroy - Se for emprestimo deleta o emprestimo e a devolucao, caso nao so a devolucao
bookReport - Lista todos os livros e ordena qual foi o mais emprestado
usersReport - Lista emprestimo, usuario, livro e data de devolucao de emprestimos pendentes