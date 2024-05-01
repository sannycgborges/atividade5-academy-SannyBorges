import { faker } from '@faker-js/faker';
import ListaUsuariosPage from '../support/pages/lista-usuarios.page';
import NovoUsuarioPage from '../support/pages/novo-usuario.page';

    describe('Testes para lista e pesquisar usuário', () => {
        let fullName = faker.person.fullName();
        let email = faker.internet.email().toLowerCase();
        var pageListUsuarios = new ListaUsuariosPage();

        beforeEach(() => {
            cy.visit('users');
        });

        it('Deve verificar se existe um link para criar um novo usuário', () => {
            cy.contains(pageListUsuarios.buttonNewUser, 'Novo').should('be.visible');
        });

        it.only('Deve verificar se possui usuários cadastrados', () => {
            cy.intercept('GET', 'api/v1/users').as('getUsuarios');
            cy.wait('@getUsuarios').then((res) => {
                cy.wait(1000);
                expect(res.response.statusCode).to.eq(200);
                expect(res.response.body).not.to.be.empty;
            })
        });

        it('Deve verificar se existe um botão Anterior e está visivel', () => {
            cy.contains(pageListUsuarios.buttonBack, 'Anterior').should('be.visible');
        });

        it('Deve verificar se existe um botão Próxima e está visivel', () => {
            cy.contains(pageListUsuarios.buttonNext, 'Próxima').should('be.visible');
        });

        it('Deve pesquisar um usuário cadastrado por e-mail.', () => {
            cy.intercept('GET', 'api/v1/search?value=*').as('getUsuario');

            pageListUsuarios.setSearch(email);

            cy.wait('@getUsuario').then((result) => {
                cy.wait(1000);
                expect(result.response.statusCode).to.eq(200);
            });
            cy.contains(pageListUsuarios.labelNewUser, 'Cadastre um novo usuário').should('be.visible');
            pageListUsuarios.clickLabelCadastreNovoUsuario();
        });

        it('Deve pesquisar um usuário por nome e retornar a opção de cadastrar um novo usuário.', () => {
            cy.intercept('GET', 'api/v1/search?value=*').as('getUsuario');

            pageListUsuarios.setSearch(fullName);

            cy.wait('@getUsuario').then((result) => {
                cy.wait(1000);
                expect(result.response.statusCode).to.eq(200);
            });
            cy.contains(pageListUsuarios.labelNewUser, 'Cadastre um novo usuário').should('be.visible');
            pageListUsuarios.clickLabelCadastreNovoUsuario();
        });

        it('Deve ser possivel cadastrar um usuário.', () => {
            pageListUsuarios.clickButtonNewUser();

            var pageNovoUsuario = new NovoUsuarioPage();

            cy.intercept('POST', 'api/v1/users').as('createUser');

            pageNovoUsuario.setInputName(fullName);
            pageNovoUsuario.setInputEmail(email);
            pageNovoUsuario.clickButtonSubmit();

            cy.wait('@createUser').then((res) => {
                cy.wait(1000);
                expect(res.response.statusCode).to.eq(201);
              });
        });

        it('Deve pesquisar um usuário por nome.', () => {
            cy.intercept('GET', 'api/v1/search?value=*').as('getUsuario');

            pageListUsuarios.setSearch(fullName);

            cy.wait('@getUsuario').then((result) => {
                cy.wait(1000);
                expect(result.response.statusCode).to.eq(200);
            });
            pageListUsuarios.getListaUsuarios().should('not.be.empty');
        });



        it('Deve pesquisar um usuário por nome e exibir os detalhes.', () => {
            cy.intercept('GET', 'api/v1/search?value=*').as('getUsuario');

            pageListUsuarios.setSearch(fullName);

            cy.wait('@getUsuario').then((result) => {
                cy.wait(1000);
                expect(result.response.statusCode).to.eq(200);
            });
            pageListUsuarios.getListaUsuarios().should('not.be.empty');

            cy.intercept('GET', 'api/v1/users/*').as('findUsuario');

            pageListUsuarios.clickUserDetail();

            cy.wait('@findUsuario').then((result) => {
                cy.wait(1000);
                expect(result.response.statusCode).to.eq(200);
                expect(result.response.body.name).to.eq(fullName);
                expect(result.response.body.email).to.eq(email);
            });
        });

    })
