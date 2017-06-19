/**
 * Created by luozheao on 2017/6/19.
 */
require.config({
    paths:{
        'bootstrap':'bootstrap.min',
        'drag':'drag',
        'jquery.ztree.core':'jquery.ztree.core',
        'jquery':'jquery-1.9.1.min',
        'underscore':'underscore',
        'jtopo':'jtopo-0.4.8',//核心代码
        'topo-main':'topo-main',//业务层框架级封装
        'topo-focus':'topo-focus'//业务层,调用暴露出的接口
    },
    shim:{
        'bootstrap':{
          deps:['jquery']
        },
        'drag':{
            deps:['jquery']
        },
        'jtopo':{
            exports:'JTopo'
        },
        'topo-main':{
            deps:['jquery','jtopo','drag'],
            exports:'topoManager'
        },
        'topo-focus':{
            deps:['topo-main']
        }
    }
});
require(['bootstrap','topo-focus']);


