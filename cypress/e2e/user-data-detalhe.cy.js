import { faker } from '@faker-js/faker';
import NovoUsuarioPage from '../support/pages/novo-usuario.page';
import ListaUsuariosPage from '../support/pages/lista-usuarios.page';
import UserDataDetalhePage from '../support/pages/user-data-detalhe.page';

describe('Teste de detalhes do usuário', () => {

    var fullName;
    var email;

    var pageNovoUsuario = new NovoUsuarioPage();
    var pageListUsuarios = new ListaUsuariosPage();
    var pageUserDataDetalhe = new UserDataDetalhePage();

    beforeEach(() => {
        cy.visit('users');

        fullName = faker.person.fullName().replace("-", " ");
        email = faker.internet.email().toLowerCase();

        // Create user
        pageListUsuarios.clickButtonNewUser();

        cy.intercept('POST', 'api/v1/users').as('createUser');

        pageNovoUsuario.setInputName(fullName);
        pageNovoUsuario.setInputEmail(email);
        pageNovoUsuario.clickButtonSubmit();

        cy.wait('@createUser').then(() => {
            cy.wait(2000);
        });

        // Back list users
        pageNovoUsuario.clickButtonBack();

        // Filtrando o usuário
        cy.intercept('GET', 'api/v1/search?value=*').as('findUser');
        pageListUsuarios.setSearch(fullName);

        cy.wait('@findUser').then(() => {
            cy.wait(2000);
        });

        //Acessando detalhes do usuário
        cy.intercept('GET', 'api/v1/users/*').as('detailsUser');

        pageUserDataDetalhe.clickButtonUserDetail();

        cy.wait('@detailsUser').then(() => {
            cy.wait(2000);
        });
    });

    it('Deve verificar se existe um botão para editar.', () => {
        cy.contains('Editar').should('be.visible');
    });

    it('Deve verificar se existe um botão para salvar.', () => {
        cy.contains('Salvar').should('be.visible');
        cy.contains('Salvar').should('be.disabled');
    });

    it('Deve atualizar o e-mail do usuário.', () => {
        pageUserDataDetalhe.clickButtonEdit();

        cy.contains('Cancelar').should('be.visible');
        cy.contains('Salvar').should('be.enabled');

        pageUserDataDetalhe.clearInputEmail();

        email = faker.internet.email().toLowerCase();

        pageUserDataDetalhe.setInputEmail(email);

        cy.intercept('PUT', 'api/v1/users/*').as('editUser');

        pageUserDataDetalhe.clickButtonSubmit();

        cy.wait('@editUser').then((res) => {
            cy.wait(2000);
            expect(res.response.statusCode).to.eq(200);
        });
    });

});
