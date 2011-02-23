L.extend({
	
	/**
	 * Regex's
	 */
	r_xhtmlTag: /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	
	/**
	 * Retorna o node name do elemento
	 * @param [object] elem
	 */
	nodeName: function(elem){
		return elem.nodeName.toLowerCase();
	}
	
});

/**
 * Protótipos
 */
L.implement({
	
	/**
	 * Valores padrão
	 */
	selector: '',
	context: document,
	length: 0,
	
	/**
	 * Faz com que o this seja uma array :P - roubei do jQuery 
	 */
	push: [].push,
	sort: [].sort,
	splice: [].splice,
	
	/**
	 * Seleciona os elementos de acordo com o selector
	 *  - #id
	 *  - .class
	 *  - div
	 * @param [string|object] selector
	 * @param [object] context
	 */
	init: function(selector, context){
	
		var dom = [];
		selector = selector || document;
		context = context && context.nodeType ? context : document;

		/**
		 * DOM :)
		 */
		if(selector.nodeType){
			dom[0] = selector;
			
		/**
		 * IDS
		 */
		}else if(selector.indexOf('#') == 0){
			dom[0] = context.getElementById( selector.replace('#', '') );

		/**
		 * Classes
		 */
		}else if(selector.indexOf('.') == 0){
			dom = context.getElementsByClassName(selector.replace('.', ''));
			
		/**
		 * TAGs
		 */	
		}else{
			dom = context.getElementsByTagName(selector);
		}
		
		if(!dom) return this;
		
		this.selector = selector;
		this.context = context;
		
		/**
		 * Puxa os elementos
		 */
		if(dom.length){
			
			for(var i = 0, l = dom.length; i < l; i++) this.push( dom[i] );
			this.length = dom.length;
			
		}else{
			
			this.push( dom[0] );
			this.length = 1;
		
		} 

		return this;
	},
	
	/**
	 * Processa cada elemento, semelhante a Array.each
	 * @param [function] fn
	 */
	each: function(fn){
		
		return Array.each(this, function(elem, index){
			fn.call(elem, index, elem);
		}, this);
	},
	
	/**
	 * Retorna o número de elementos selecionados
	 */
	size: function(){
		return this.length;
	},
	
	/**
	 * Retorna o elemento da posição eq
	 * @param [number] eq
	 */
	eq: function(eq){
		return L(this[eq]);
	},
    
    /**
     * Retorna o primeiro elemento
     */
    first: function(){
    	return L(this[0]);
    },
    
    /**
     * Retorna o último elemento
     */
    last: function(){
    	return L(this[this.length - 1]);
    },
	
	/**
	 * Recupera/Seta o HTML do elemento
	 * @param optional [string] value
	 */
	html: function(value){
		
		/**
		 * Seta o HTML
		 */
		if(typeof value === 'string'){
			
			value = value.toLowerCase().replace(L.r_xhtmlTag, '<$1></$2>');
			
			return this.each(function(){
				
				if(this.nodeType === 1){
					this.innerHTML = value;
				}
				
			});
				
		}
		
		return this[0] && this[0].nodeType === 1 ? this[0].innerHTML : null;
	},
	
	/**
	 * Recupera/Seta o texto ao elemento
	 * @param optional [string] text
	 */
	text: function(text){
		
		var all = document.all;
		
		/**
		 * Seta o texto
		 */
		if(typeof text === 'string'){
			
			return this.each(function(){
			
				if(all)
					this.innerText = text;
				else
					this.textContent = text;
				
			});

		}
		
		return (all)? this[0].innerText : this[0].textContent;
	},
	
	/**
	 * Recupera/Seta um atributo ao elemento
	 * @param [string] name
	 * @param optional [mixed] value
	 */
	attr: function(name, value){
		
		if(value != undefined){
			
			this.each(function(){
				this.setAttribute(name, value);
			});
			
		}
		
		return this[0].getAttribute(name);
	},
	
	/**
	 * Remove um atributo dos elementos
	 * @param [string] name
	 */	
	removeAttr: function(name){
		
		return this.each(function(){

			this[name] = '';
			
			if(this.nodeType === 1)
				this.removeAttribute(name);
        
        });
	
	},
	
	/**
	 * Recupera/Seta um atributo do tipo data-
	 * @param [string] name
	 * @param optional [mixed] value
	 */
	data: function(name, value){
		return this.attr('data-' + name, value);
	},
	
	/**
	 * Remove um atributo data- dos elementos
	 * @param [string] name
	 */	
	removeData: function(name){
		return this.removeAttr('data-' + name);
	},
	
	/**
	 * Recupera/Seta o valor do input atual. input: input|textarea|select|...
	 * @param optional [mixed] value
	 */
	val: function(value){
	
		/**
		 * Recupera os valores
		 */
		if(value == undefined){
			
			if(!this.length) return undefined;
			
			var elem = this[0],
				nodeName = L.nodeName(elem);
			
			/**
			 * Se for select
			 */
			if(nodeName == 'select'){
				
				var index = elem.selectedIndex,
                    values = [],
                    options = elem.options,
                    one = elem.type == 'select-one';
				
				/**
				 * Valor único
				 */
				if(one){
					return index >= 0 ? 
						
						options[index].hasAttribute('value') ? 
							options[index].value : 
							options[index].text : 
						
						null;
				}
				
				/**
				 * Junta os valores
				 */
				Array.each(options, function(option){
					
					if(option.selected)
						values.push( option.hasAttribute('value') ? option.value : option.text );
				});
				
				return values;
			}
			
			/**
			 * Demais itens
			 */
			return (elem.value || "").replace(/\r/g, "");			
		}
		
		if( value.constructor == Number ) value += '';
		
		/**
		 * Seta o valor
		 */
		return this.each(function(){
		
			if(this.nodeType != 1) return;
			
			/**
			 * Se for radio/checkbox
			 */
			if( value.constructor == Array && /radio|checkbox/.test(this.type) ){
				
				this.checked = ( value.indexOf(this.value) >= 0 || value.indexOf(this.name) >= 0);
			
			/**
			 * Se for select
			 */
			}else if( L.nodeName(this) == 'select' ){
				
				/**
				 * Força Array
				 */
				var values = !L.is('array', value)? [value] : value;

				/**
				 * Processa cada opção do array
				 */
				L('option', this).each(function(){
				
				   	this.selected = ( values.indexOf(this.value) >= 0 || values.indexOf(this.text) >= 0);
            	
            	});

            	if(!values.length) this.selectedIndex = -1;
			
			/**
			 * Demais
			 */
        	}else{
        		this.value = value;
    		}
    	});
	}	
});