export class EmailServer {
    //PACIENTE
    // pacienteCreated;

    constructor() {
        //PACIENTE
        // this.pacienteCreated = new SendEmailPacienteCreatedFaker();
    }

    async start() {
        // EventHandle.on(SEND_MAIL_EVENTS.PACIENTE_CREATED, data => {
        //     const emailUseCase = new EmailUseCases(this.pacienteCreated);
        //     emailUseCase.pacienteCreated(data);
        // });
        // EventHandle.on(SEND_MAIL_EVENTS.SOLICITACAO_STATUS_UPDATE, data => {
        //     const emailUseCase = new EmailUseCases(this.solicitacaoStatusUpdated);
        //     emailUseCase.solicitacaoStatusUpdated(data);
        // });
        // EventHandle.on(SEND_MAIL_EVENTS.USER_UPDATE_PASSWORD, data => {
        //     const emailUseCase = new EmailUseCases(this.userUpdatePassword);
        //     emailUseCase.userUpdatePassword(data);
        // });
    }
}

export default new EmailServer();
