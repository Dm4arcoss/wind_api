import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
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


}
