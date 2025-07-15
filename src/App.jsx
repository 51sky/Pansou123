import { useState } from 'react'
import { Search, Settings, Loader2, ExternalLink, Copy, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedOptions, setAdvancedOptions] = useState({
    res: 'merge',
    src: 'all',
    plugins: ['pansearch', 'qupansou', 'panta', 'pan666', 'hunhepan', 'jikepan'],
    refresh: false,
    conc: 10
  })

  const pluginOptions = [
    'pansearch', 'qupansou', 'panta', 'pan666', 'hunhepan', 'jikepan'
  ]

  const panTypeConfig = {
    baidu: { 
      name: '百度网盘', 
      icon: '🔵', 
      color: 'bg-blue-500', 
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50'
    },
    aliyun: { 
      name: '阿里云盘', 
      icon: '🟠', 
      color: 'bg-orange-500', 
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50'
    },
    quark: { 
      name: '夸克网盘', 
      icon: '🟣', 
      color: 'bg-purple-500', 
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50'
    },
    tianyi: { 
      name: '天翼云盘', 
      icon: '🔴', 
      color: 'bg-red-500', 
      textColor: 'text-red-700',
      bgColor: 'bg-red-50'
    },
    uc: { 
      name: 'UC网盘', 
      icon: '🟢', 
      color: 'bg-green-500', 
      textColor: 'text-green-700',
      bgColor: 'bg-green-50'
    },
    caiyun: { 
      name: '移动云盘', 
      icon: '🔵', 
      color: 'bg-cyan-500', 
      textColor: 'text-cyan-700',
      bgColor: 'bg-cyan-50'
    },
    '115': { 
      name: '115网盘', 
      icon: '🟡', 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50'
    },
    pikpak: { 
      name: 'PikPak', 
      icon: '🟤', 
      color: 'bg-amber-500', 
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50'
    },
    xunlei: { 
      name: '迅雷网盘', 
      icon: '⚡', 
      color: 'bg-indigo-500', 
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50'
    },
    '123': { 
      name: '123网盘', 
      icon: '🔢', 
      color: 'bg-teal-500', 
      textColor: 'text-teal-700',
      bgColor: 'bg-teal-50'
    },
    magnet: { 
      name: '磁力链接', 
      icon: '🧲', 
      color: 'bg-gray-500', 
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50'
    },
    ed2k: { 
      name: '电驴链接', 
      icon: '🔗', 
      color: 'bg-slate-500', 
      textColor: 'text-slate-700',
      bgColor: 'bg-slate-50'
    }
  }

  const getPanTypeInfo = (type) => {
    return panTypeConfig[type] || { 
      name: type, 
      icon: '📁', 
      color: 'bg-gray-500', 
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50'
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        kw: searchQuery,
        refresh: advancedOptions.refresh.toString(),
        res: advancedOptions.res,
        src: advancedOptions.src,
        plugins: advancedOptions.plugins.join(',')
      })

      const response = await fetch(`http://195.133.5.152:1234/api/search?${params}`)
      const data = await response.json()
      
      if (response.ok && data.code === 0) {
        // API返回格式为 {code: 0, message: "success", data: {...}}
        setSearchResults(data.data)
      } else {
        console.error('搜索失败:', data.message)
        alert('搜索失败: ' + (data.message || '未知错误'))
      }
    } catch (error) {
      console.error('搜索出错:', error)
      alert('搜索出错: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePluginChange = (plugin, checked) => {
    setAdvancedOptions(prev => ({
      ...prev,
      plugins: checked 
        ? [...prev.plugins, plugin]
        : prev.plugins.filter(p => p !== plugin)
    }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  }

  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return '未知时间'
    return new Date(dateString).toLocaleString('zh-CN')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">
              🔍 PanSou 网盘搜索
            </h1>
            <p className="text-lg opacity-90 mb-4">
              高性能网盘资源搜索引擎 - 支持多种网盘类型和Telegram频道搜索
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span>基于 
                <a href="https://github.com/fish2018/pansou" target="_blank" rel="noopener noreferrer" 
                   className="text-yellow-300 hover:text-yellow-200 underline ml-1">
                  PanSou API
                </a>
              </span>
              <span>构建 | 原作者: 
                <a href="https://github.com/fish2018" target="_blank" rel="noopener noreferrer"
                   className="text-yellow-300 hover:text-yellow-200 underline ml-1">
                  fish2018
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-6">
            {/* Search Input */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="请输入搜索关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-lg h-12"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isLoading || !searchQuery.trim()}
                className="h-12 px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                搜索
              </Button>
            </div>

            {/* Advanced Options */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="mb-4">
                  <Settings className="w-4 h-4 mr-2" />
                  🔧 高级选项
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">结果类型</label>
                    <Select value={advancedOptions.res} onValueChange={(value) => 
                      setAdvancedOptions(prev => ({ ...prev, res: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="merge">按类型合并 (推荐)</SelectItem>
                        <SelectItem value="all">全部结果</SelectItem>
                        <SelectItem value="results">仅结果列表</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">数据来源</label>
                    <Select value={advancedOptions.src} onValueChange={(value) => 
                      setAdvancedOptions(prev => ({ ...prev, src: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部来源</SelectItem>
                        <SelectItem value="tg">仅Telegram</SelectItem>
                        <SelectItem value="plugin">仅插件</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">搜索插件</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {pluginOptions.map(plugin => (
                      <div key={plugin} className="flex items-center space-x-2">
                        <Checkbox
                          id={plugin}
                          checked={advancedOptions.plugins.includes(plugin)}
                          onCheckedChange={(checked) => handlePluginChange(plugin, checked)}
                        />
                        <label htmlFor={plugin} className="text-sm">{plugin}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="refresh"
                    checked={advancedOptions.refresh}
                    onCheckedChange={(checked) => 
                      setAdvancedOptions(prev => ({ ...prev, refresh: checked }))}
                  />
                  <label htmlFor="refresh" className="text-sm">强制刷新 (不使用缓存)</label>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults && (
          <Card className="max-w-4xl mx-auto mt-6 bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>搜索结果</span>
                <Badge variant="secondary">
                  共找到 {searchResults.total || 0} 个结果
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.merged_by_type && Object.keys(searchResults.merged_by_type).length > 0 ? (
                <Tabs defaultValue={Object.keys(searchResults.merged_by_type)[0]} className="w-full">
                  <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 p-4 bg-muted/50 rounded-lg min-h-fit">
                    {Object.entries(searchResults.merged_by_type).map(([type, results]) => {
                      const panInfo = getPanTypeInfo(type)
                      return (
                        <TabsTrigger 
                          key={type} 
                          value={type} 
                          className={`flex items-center gap-2 p-3 rounded-lg transition-all border-2 border-transparent ${panInfo.textColor} hover:${panInfo.bgColor} hover:border-current/20 data-[state=active]:${panInfo.bgColor} data-[state=active]:border-current/30 data-[state=active]:shadow-md`}
                        >
                          <span className="text-2xl">{panInfo.icon}</span>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium leading-tight">{panInfo.name}</span>
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-white/90 border">
                              {results.length}
                            </Badge>
                          </div>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                  
                  {Object.entries(searchResults.merged_by_type).map(([type, results]) => {
                    const panInfo = getPanTypeInfo(type)
                    return (
                      <TabsContent key={type} value={type} className="mt-4">
                        <div className="space-y-3">
                          {results.map((result, index) => (
                          <Card key={index} className={`p-4 hover:shadow-md transition-shadow border-l-4 ${panInfo.color} ${panInfo.bgColor}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl">{panInfo.icon}</span>
                                  <Badge variant="outline" className={`${panInfo.textColor} border-current`}>
                                    {panInfo.name}
                                  </Badge>
                                </div>
                                <h4 className="font-medium text-lg mb-2">{result.note || result.title || '未知资源'}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatDate(result.datetime)}
                                  </div>
                                  {result.channel && (
                                    <div className="flex items-center gap-1">
                                      <Tag className="w-4 h-4" />
                                      {result.channel}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <code className="bg-white/70 px-3 py-2 rounded-lg text-sm flex-1 break-all border">
                                    {result.url}
                                  </code>
                                  {result.password && (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                      🔑 {result.password}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(result.url + (result.password ? ` 密码: ${result.password}` : ''))}
                                  className="hover:bg-blue-50"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => window.open(result.url, '_blank')}
                                  className={`${panInfo.color} hover:opacity-90 text-white`}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    )
                  })}
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无搜索结果，请尝试其他关键词
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="max-w-4xl mx-auto mt-6 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  🔍 搜索资源
                </h3>
                <p className="text-sm text-gray-600">
                  在搜索框中输入关键词，支持中文、英文搜索。系统会自动搜索多个网盘平台的资源。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  📂 浏览结果
                </h3>
                <p className="text-sm text-gray-600">
                  搜索结果按网盘类型分类显示，点击不同标签页查看各平台的资源。每个资源显示文件名、大小等信息。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  🔧 高级选项
                </h3>
                <p className="text-sm text-gray-600">
                  点击"高级选项"可以自定义搜索参数，包括结果类型、数据来源、自定义频道、并发数量等，实现更精准的搜索。
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                💡 搜索技巧
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 使用具体的关键词联合搜索会得到更精准的结果</li>
                <li>• 支持搜索电影、软件、文档、音乐等各类资源</li>
                <li>• 建议使用中文关键词搜索中文资源</li>
                <li>• 可以在高级选项中自定义频道，每行输入一个频道名</li>
                <li>• 如果没有找到结果，可以尝试使用不同的关键词</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>
            本站基于开源项目 
            <a href="https://github.com/fish2018/pansou" target="_blank" rel="noopener noreferrer"
               className="text-yellow-300 hover:text-yellow-200 underline mx-1">
              PanSou
            </a>
            构建
          </p>
          <p className="mt-1">
            原作者: 
            <a href="https://github.com/fish2018" target="_blank" rel="noopener noreferrer"
               className="text-yellow-300 hover:text-yellow-200 underline ml-1">
              fish2018
            </a>
            | 感谢提供优秀的网盘搜索API服务
          </p>
          <p className="mt-2 text-xs">
            本站仅提供搜索服务，不存储任何文件，所有资源版权归原作者所有
          </p>
        </div>
      </div>
    </div>
  )
}

export default App



