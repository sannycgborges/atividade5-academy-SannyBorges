import { faker } from '@faker-js/faker';
import NovoUsuarioPage from '../support/pages/novo-usuario.page';

  describe('Testes para criação de novo usuário.', () => {
    var pageNovoUsuario = new NovoUsuarioPage();
    var username = faker.person.fullName().replace(".", "").replace("-", "");
    var email = faker.internet.email();

    beforeEach(() => {
        cy.visit('users/novo');
    });

    it('Deve verificar se existe um link para voltar para a lista de usuários', () => {
      cy.contains(pageNovoUsuario.linkVoltar, 'Voltar').should('be.visible');
    });

    it('Não deve ser possivel cadastrar um usuário sem informar o nome.', () => {
      pageNovoUsuario.setEmail(email);
      pageNovoUsuario.clickButtonSubmit();
      pageNovoUsuario.getError().should('eq', 'O campo nome é obrigatório.');
    });

    it('Não deve ser possivel cadastrar um usuário sem informar o email.', () => {
      pageNovoUsuario.setUsername(username);
      pageNovoUsuario.clickButtonSubmit();
      pageNovoUsuario.getError().should('eq', 'O campo e-mail é obrigatório.');
    });

    it('Não deve ser possivel cadastrar um usuário com email inválido.', () => {
      pageNovoUsuario.setUsername(username);
      pageNovoUsuario.setEmail('sanny.borges');
      pageNovoUsuario.clickButtonSubmit();
      pageNovoUsuario.getError().should('eq', 'Formato de e-mail inválido');
    });

    it('Deve ser possivel cadastrar um usuário.', () => {
      cy.intercept('POST', 'api/v1/users').as('postUsuario');
      
      pageNovoUsuario.setUsername(username);
      pageNovoUsuario.setEmail(email);
      pageNovoUsuario.clickButtonSubmit();

      cy.wait('@postUsuario').then((res) => {
        cy.wait(1000);
        expect(res.response.statusCode).to.eq(201);
      });
    });

    it('Deve ocorrer um erro quando o e-mail já estiver em uso.', () => {
      cy.intercept('POST', 'api/v1/users').as('postUsuario');

      pageNovoUsuario.setUsername(username);
      pageNovoUsuario.setEmail(email);
      pageNovoUsuario.clickButtonSubmit();

      cy.wait('@postUsuario').then((res) => {
        cy.wait(1000);
        expect(res.response.statusCode).to.eq(422);
        expect(res.response.body.error).to.eq('User already exists.');
      });
    });

  });