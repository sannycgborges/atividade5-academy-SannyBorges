import { faker } from '@faker-js/faker';
import NovoUsuarioPage from '../support/pages/novo-usuario.page';

  describe('Testes para criação de novo usuário.', () => {
    var page = new NovoUsuarioPage();
    var username = faker.person.fullName();
    var email = faker.internet.email().toLowerCase();

    beforeEach(() => {
        cy.visit('users/novo');
    });

    it('Deve verificar se existe um link para voltar para a lista de usuários', () => {
      cy.contains(page.buttonBack, 'Voltar').should('be.visible');
    });

    it('Não deve ser possivel cadastrar um usuário sem informar o nome.', () => {
      page.setInputEmail(email);
      page.clickButtonSubmit();
    });

    it('Não deve ser possivel cadastrar um usuário sem informar o email.', () => {
      page.setInputName(username);
      page.clickButtonSubmit();
    });

    it('Não deve ser possivel cadastrar um usuário com email inválido.', () => {
      page.setInputName(username);
      page.setInputEmail('sanny.borges');
      page.clickButtonSubmit();
    });

    it('Deve ser possivel cadastrar um usuário.', () => {
      cy.intercept('POST', 'api/v1/users').as('createUser');
      
      page.setInputName(username);
      page.setInputEmail(email);
      page.clickButtonSubmit();

      cy.wait('@createUser').then((res) => {
        cy.wait(1000);
        expect(res.response.statusCode).to.eq(201);
      });
    });

    it('Deve ocorrer um erro quando o e-mail já estiver em uso.', () => {
      cy.intercept('POST', 'api/v1/users').as('createDuplicateUser');

      page.setInputName(username);
      page.setInputEmail(email);
      page.clickButtonSubmit();

      cy.wait('@createDuplicateUser').then((res) => {
        cy.wait(1000);
        expect(res.response.statusCode).to.eq(422);
        expect(res.response.body.error).to.eq('User already exists.');
      });
    });

  });