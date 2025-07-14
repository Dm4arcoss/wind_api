import { Controller, Post, Body, Get, Param, UseGuards, Request, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('process')
  @ApiOperation({ summary: 'Processar pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento processado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async process(@Body() createPaymentDto: CreatePaymentDto, @Request() req: any) {
    return this.paymentService.createPayment(createPaymentDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  @ApiOperation({ summary: 'Buscar pagamentos do usuário' })
  @ApiResponse({ status: 200, description: 'Pagamentos retornados com sucesso' })
  async getUserPayments(@Request() req: any) {
    return this.paymentService.getUserPayments(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiResponse({ status: 200, description: 'Pagamento retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async getPaymentById(@Param('id') id: string, @Request() req: any) {
    return this.paymentService.getPaymentById(parseInt(id), req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('order/:orderId')
  @ApiOperation({ summary: 'Buscar pagamentos por pedido' })
  @ApiResponse({ status: 200, description: 'Pagamentos retornados com sucesso' })
  async getPaymentsByOrder(@Param('orderId') orderId: string, @Request() req: any) {
    return this.paymentService.getPaymentsByOrder(parseInt(orderId), req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/confirm-pix')
  @ApiOperation({ summary: 'Confirmar pagamento PIX' })
  @ApiResponse({ status: 200, description: 'Pagamento PIX confirmado com sucesso' })
  @ApiResponse({ status: 400, description: 'Pagamento não é PIX ou já foi processado' })
  async confirmPixPayment(@Param('id') id: string, @Request() req: any) {
    return this.paymentService.confirmPixPayment(parseInt(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/confirm-boleto')
  @ApiOperation({ summary: 'Confirmar pagamento de boleto' })
  @ApiResponse({ status: 200, description: 'Pagamento de boleto confirmado com sucesso' })
  @ApiResponse({ status: 400, description: 'Pagamento não é boleto ou já foi processado' })
  async confirmBoletoPayment(@Param('id') id: string, @Request() req: any) {
    return this.paymentService.confirmBoletoPayment(parseInt(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento cancelado com sucesso' })
  @ApiResponse({ status: 400, description: 'Não é possível cancelar pagamento concluído' })
  async cancelPayment(@Param('id') id: string, @Request() req: any) {
    return this.paymentService.cancelPayment(parseInt(id), req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/refund')
  @ApiOperation({ summary: 'Reembolsar pagamento' })
  @ApiResponse({ status: 200, description: 'Reembolso processado com sucesso' })
  @ApiResponse({ status: 400, description: 'Só é possível reembolsar pagamentos concluídos' })
  async refundPayment(
    @Param('id') id: string, 
    @Body() body: { amount?: number },
    @Request() req: any
  ) {
    return this.paymentService.refundPayment(parseInt(id), req.user.id, body.amount);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/status')
  @ApiOperation({ summary: 'Atualizar status do pagamento' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Request() req: any
  ) {
    return this.paymentService.updatePaymentStatus(parseInt(id), body.status);
  }
}
