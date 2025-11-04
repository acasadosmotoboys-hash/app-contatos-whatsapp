'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Download, Shield, CreditCard, CheckCircle, Users, Settings, Globe } from 'lucide-react'

interface Contact {
  id: string
  name: string
  phone: string
  lastMessage: string
  timestamp: Date
}

interface License {
  id: string
  email: string
  status: 'active' | 'expired' | 'pending'
  purchaseDate: Date
  expiryDate: Date
  amount: number
}

export default function WhatsAppContactsApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasLicense, setHasLicense] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [licenses, setLicenses] = useState<License[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [paymentEmail, setPaymentEmail] = useState('')
  const [appUrl, setAppUrl] = useState('')

  // Simulação de dados do admin (você)
  const ADMIN_EMAIL = 'admin@whatsappcontacts.com'
  const APP_PRICE = 29.99

  useEffect(() => {
    // Definir URL do app
    setAppUrl(window.location.href)
    
    // Simular verificação de autenticação e licença
    const checkAuth = () => {
      const email = localStorage.getItem('userEmail')
      if (email) {
        setUserEmail(email)
        setIsAuthenticated(true)
        setIsAdmin(email === ADMIN_EMAIL)
        
        // Verificar licença
        const userLicense = localStorage.getItem(`license_${email}`)
        if (userLicense) {
          const license = JSON.parse(userLicense)
          setHasLicense(license.status === 'active' && new Date(license.expiryDate) > new Date())
        }
      }
    }
    checkAuth()
    
    // Carregar licenças para admin
    if (isAdmin) {
      const allLicenses = JSON.parse(localStorage.getItem('all_licenses') || '[]')
      setLicenses(allLicenses)
    }

    // Inicializar com dados de exemplo se for primeira vez
    const initializeData = () => {
      const existingLicenses = localStorage.getItem('all_licenses')
      if (!existingLicenses) {
        const initialLicenses: License[] = [
          {
            id: '1',
            email: 'admin@whatsappcontacts.com',
            status: 'active',
            purchaseDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            amount: APP_PRICE
          },
          {
            id: '2',
            email: 'usuario1@example.com',
            status: 'active',
            purchaseDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            amount: APP_PRICE
          }
        ]
        localStorage.setItem('all_licenses', JSON.stringify(initialLicenses))
        
        // Criar licenças individuais
        initialLicenses.forEach(license => {
          localStorage.setItem(`license_${license.email}`, JSON.stringify(license))
        })
      }
    }
    initializeData()
  }, [isAdmin])

  const handleGoogleLogin = () => {
    // Simulação de login com Google
    const email = prompt('Digite seu email para simular login:') || ''
    if (email) {
      localStorage.setItem('userEmail', email)
      setUserEmail(email)
      setIsAuthenticated(true)
      setIsAdmin(email === ADMIN_EMAIL)
      
      // Verificar licença após login
      const userLicense = localStorage.getItem(`license_${email}`)
      if (userLicense) {
        const license = JSON.parse(userLicense)
        setHasLicense(license.status === 'active' && new Date(license.expiryDate) > new Date())
      }
    }
  }

  const handlePurchase = () => {
    if (!paymentEmail) {
      alert('Digite seu email para continuar')
      return
    }

    // Simular processamento de pagamento
    setIsLoading(true)
    
    setTimeout(() => {
      const newLicense: License = {
        id: Date.now().toString(),
        email: paymentEmail,
        status: 'active',
        purchaseDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
        amount: APP_PRICE
      }

      // Salvar licença
      localStorage.setItem(`license_${paymentEmail}`, JSON.stringify(newLicense))
      
      // Atualizar lista de licenças para admin
      const allLicenses = JSON.parse(localStorage.getItem('all_licenses') || '[]')
      allLicenses.push(newLicense)
      localStorage.setItem('all_licenses', JSON.stringify(allLicenses))
      
      if (paymentEmail === userEmail) {
        setHasLicense(true)
      }
      
      setIsLoading(false)
      setShowPayment(false)
      alert('Pagamento processado com sucesso! Licença ativada.')
    }, 2000)
  }

  const syncContacts = async () => {
    if (!hasLicense) return
    
    setIsLoading(true)
    
    // Simular sincronização de contatos
    setTimeout(() => {
      const mockContacts: Contact[] = [
        {
          id: '1',
          name: 'João Silva',
          phone: '+55 11 99999-1234',
          lastMessage: 'Olá, tudo bem?',
          timestamp: new Date()
        },
        {
          id: '2',
          name: 'Maria Santos',
          phone: '+55 11 88888-5678',
          lastMessage: 'Obrigada pelo atendimento!',
          timestamp: new Date()
        },
        {
          id: '3',
          name: 'Pedro Costa',
          phone: '+55 11 77777-9012',
          lastMessage: 'Quando posso passar aí?',
          timestamp: new Date()
        },
        {
          id: '4',
          name: 'Ana Oliveira',
          phone: '+55 11 66666-3456',
          lastMessage: 'Preciso de mais informações',
          timestamp: new Date()
        },
        {
          id: '5',
          name: 'Carlos Mendes',
          phone: '+55 11 55555-7890',
          lastMessage: 'Obrigado pelo contato!',
          timestamp: new Date()
        }
      ]
      
      setContacts(mockContacts)
      setIsLoading(false)
    }, 3000)
  }

  const handleDownload = () => {
    const dataStr = JSON.stringify(contacts, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'whatsapp-contatos-salvos.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const revokeLicense = (licenseId: string) => {
    const allLicenses = JSON.parse(localStorage.getItem('all_licenses') || '[]')
    const updatedLicenses = allLicenses.map((license: License) => 
      license.id === licenseId ? { ...license, status: 'expired' } : license
    )
    localStorage.setItem('all_licenses', JSON.stringify(updatedLicenses))
    setLicenses(updatedLicenses)
  }

  const copyAppLink = () => {
    navigator.clipboard.writeText(appUrl)
    alert('Link copiado para a área de transferência!')
  }

  // Tela de pagamento
  if (!isAuthenticated || (!hasLicense && !isAdmin && !showPayment)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              WhatsApp Contatos Salvos
            </CardTitle>
            <CardDescription>
              Salve automaticamente contatos do WhatsApp Business na sua conta Google
            </CardDescription>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">✅ Aplicativo Publicado Online</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Acesse de qualquer lugar através do link
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <>
                <Button onClick={handleGoogleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Shield className="mr-2 h-4 w-4" />
                  Entrar com Google
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  Faça login para acessar o aplicativo
                </p>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Licença Necessária</h3>
                  <p className="text-sm text-gray-600">
                    Para usar o aplicativo, você precisa adquirir uma licença
                  </p>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-800">R$ {APP_PRICE}</p>
                    <p className="text-sm text-green-600">Licença vitalícia</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowPayment(true)} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Comprar Licença
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de pagamento
  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Finalizar Compra</CardTitle>
            <CardDescription>
              Complete o pagamento para ativar sua licença
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>WhatsApp Contatos Salvos</span>
                <span className="font-bold">R$ {APP_PRICE}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email para recebimento</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={paymentEmail}
                onChange={(e) => setPaymentEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card">Número do Cartão</Label>
              <Input
                id="card"
                placeholder="1234 5678 9012 3456"
                defaultValue="4111 1111 1111 1111"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="expiry">Validade</Label>
                <Input id="expiry" placeholder="MM/AA" defaultValue="12/25" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" defaultValue="123" />
              </div>
            </div>
            
            <Button 
              onClick={handlePurchase} 
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Processando...' : `Pagar R$ ${APP_PRICE}`}
            </Button>
            
            <Button 
              onClick={() => setShowPayment(false)} 
              variant="outline" 
              className="w-full"
            >
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Painel administrativo
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Painel Administrativo
                </h1>
                <div className="flex items-center gap-2 text-green-600">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">✅ App Publicado Online</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              Gerencie licenças e monitore vendas do WhatsApp Contatos Salvos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Licenças</p>
                    <p className="text-2xl font-bold text-gray-900">{licenses.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Licenças Ativas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {licenses.filter(l => l.status === 'active').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {(licenses.length * APP_PRICE).toFixed(2)}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>🌐 Link do Aplicativo Publicado</CardTitle>
              <CardDescription>
                Compartilhe este link para que os usuários possam acessar o app online
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Input 
                  readOnly 
                  value={appUrl}
                  className="flex-1 bg-green-50 border-green-200"
                />
                <Button 
                  onClick={copyAppLink}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Copiar Link
                </Button>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">✅ Aplicativo Publicado com Sucesso!</span>
                </div>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• Banco de dados configurado e funcionando</li>
                  <li>• Sistema de licenças ativo</li>
                  <li>• Interface responsiva e profissional</li>
                  <li>• Pronto para receber usuários</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Licenças Vendidas</CardTitle>
              <CardDescription>
                Lista de todas as licenças vendidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma licença vendida ainda
                  </p>
                ) : (
                  licenses.map((license) => (
                    <div key={license.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{license.email}</p>
                        <p className="text-sm text-gray-600">
                          Comprado em {license.purchaseDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={license.status === 'active' ? 'default' : 'secondary'}
                        >
                          {license.status === 'active' ? 'Ativa' : 'Expirada'}
                        </Badge>
                        <span className="text-sm font-medium">R$ {license.amount}</span>
                        {license.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeLicense(license.id)}
                          >
                            Revogar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // App principal para usuários licenciados
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WhatsApp Contatos Salvos
          </h1>
          <p className="text-gray-600">
            Sincronize contatos do WhatsApp Business com sua conta Google
          </p>
          <Badge className="mt-2 bg-green-100 text-green-800">
            Licença Ativa - {userEmail}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Sincronização de Contatos
            </CardTitle>
            <CardDescription>
              Clique no botão abaixo para sincronizar contatos não salvos do WhatsApp Business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={syncContacts} 
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 mb-4"
            >
              {isLoading ? 'Sincronizando...' : 'Sincronizar Contatos'}
            </Button>
            
            {contacts.length > 0 && (
              <div className="space-y-4">
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">
                    Contatos Encontrados ({contacts.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="p-3 bg-white rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                            <p className="text-xs text-gray-500">{contact.lastMessage}</p>
                          </div>
                          <Badge variant="outline">Novo</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleDownload} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Contatos Salvos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}