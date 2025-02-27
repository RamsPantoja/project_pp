import { RESTDataSource } from "apollo-datasource-rest";

class MercadoPagoAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'https://api.mercadopago.com/';
    }

    willSendRequest(request) {
        request.headers.set('Authorization', `Bearer ${process.env.ACCESS_TOKEN_MP}`);
    }
  
    //Hace una peticion por metodo POST a la url: https://api.mercadopago.com/preapproval_plan, para crear un plan de suscrpción.
    async createPreapprovalPlan(preapproval_preference) {
      return this.post(
        `preapproval_plan`, // path
        preapproval_preference, // request body
      );
    }

    //Haace una peticion por metodo get a la https://api.mercadopago.com/preapproval/search, para obtener todos los usuarios inscritos a una suscripcion especifica.
    async getUsersInSuscription(limit, offset, preapproval_plan_id) {
      const data = await this.get(`preapproval/search`, {
        limit: limit,
        offset: offset,
        preapproval_plan_id: preapproval_plan_id,
        end_date: 'NOW',
        criteria: 'desc'
      });
      return data;
    }

    //Obtiene la suscripcion con el email y el preapproval_id
    async getPreapproval(preapproval_id, email) {
      const data = await this.get(`preapproval/search`, {
        id: preapproval_id,
        payer_email: email
      })

      return data;
    }

    //Cancela un plan de suscripcion o plantilla, con el preapproval_plan_id.
    async cancelPreapprovalPlan(preapproval_plan_id) {
      const data = await this.put(
        `preapproval_plan/${preapproval_plan_id}`,
        {
          status: 'cancelled'
        }
      )

      return data;
    }
}

export default MercadoPagoAPI;
  